
import { notFound } from 'next/navigation';
import connectDB from '../../../lib/mongodb';
import Board from '../../../lib/models/Board';
import PublicBoardView from './PublicBoardView';

export async function generateMetadata({ params }) {
  try {
    await connectDB();
    const board = await Board.findById(params.id).lean();

    if (!board) {
      return { title: 'Board Not Found — MoodBoard AI' };
    }

    return {
      title: `"${board.prompt}" — MoodBoard AI`,
      description: `AI-generated mood board: ${board.keywords?.slice(0,4).join(', ')}`,
      openGraph: {
        title: `"${board.prompt}" — MoodBoard AI`,
        description: board.designDirection || `Mood board with ${board.colors?.length} colors and ${board.keywords?.length} keywords`,
        type: 'website',
      },
    };
  } catch {
    return { title: 'MoodBoard AI' };
  }
}

export default async function BoardPage({ params }) {
  let board;

  try {
    await connectDB();

    board = await Board.findById(params.id).lean();
  } catch (error) {
    console.error('Board fetch error:', error);
    notFound()
  }

  if (!board) {
    notFound();
  }

  const serializedBoard = JSON.parse(JSON.stringify(board));

  return <PublicBoardView board={serializedBoard} />;
}
