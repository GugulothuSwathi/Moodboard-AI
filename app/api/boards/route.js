
import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '../../../lib/auth';
import connectDB from '../../../lib/mongodb';
import Board from '../../../lib/models/Board';

export async function GET(request) {
  try {
    const session = await getServerSession(authOptions);

    if (!session) {
      return NextResponse.json(
        { error: 'Unauthorized — please log in' },
        { status: 401 }
      );
    }

    await connectDB();

    const boards = await Board.find({ userId: session.user.id })
      .sort({ createdAt: -1 })
      .limit(50)
      .lean()

    return NextResponse.json(boards, { status: 200 });

  } catch (error) {
    console.error('GET boards error:', error);
    return NextResponse.json({ error: 'Failed to fetch boards' }, { status: 500 });
  }
}

export async function POST(request) {
  try {
    const session = await getServerSession(authOptions);

    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const { prompt, colors, fonts, keywords, textures, images, designDirection, isPublic } = body;

    if (!prompt) {
      return NextResponse.json({ error: 'Prompt is required' }, { status: 400 });
    }

    await connectDB();

    const newBoard = await Board.create({
      userId: session.user.id,
      userEmail: session.user.email,
      prompt,
      colors: colors || [],
      fonts: fonts || [],
      keywords: keywords || [],
      textures: textures || [],
      images: images || [],
      designDirection: designDirection || '',
      isPublic: isPublic ?? false,
    });

    return NextResponse.json(newBoard, { status: 201 });

  } catch (error) {
    console.error('POST board error:', error);
    return NextResponse.json({ error: 'Failed to save board' }, { status: 500 });
  }
}

export async function DELETE(request) {
  try {
    const session = await getServerSession(authOptions);

    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const boardId = searchParams.get('id');

    if (!boardId) {
      return NextResponse.json({ error: 'Board ID required' }, { status: 400 });
    }

    await connectDB();

    const deletedBoard = await Board.findOneAndDelete({
      _id: boardId,
      userId: session.user.id,
    });

    if (!deletedBoard) {
      return NextResponse.json(
        { error: 'Board not found or not authorized' },
        { status: 404 }
      );
    }

    return NextResponse.json({ message: 'Board deleted' }, { status: 200 });

  } catch (error) {
    console.error('DELETE board error:', error);
    return NextResponse.json({ error: 'Failed to delete board' }, { status: 500 });
  }
}
