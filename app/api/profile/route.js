
import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '../../../lib/auth';
import connectDB from '../../../lib/mongodb';
import User from '../../../lib/models/User';

export async function GET() {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    await connectDB();
    const user = await User.findById(session.user.id).select(
      'name email image profileImage nickname bio location website twitter instagram createdAt'
    );

    if (!user) return NextResponse.json({ error: 'User not found' }, { status: 404 });

    return NextResponse.json({ user });
  } catch (err) {
    console.error('GET /api/profile error:', err);
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
}

export async function PATCH(request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const { nickname, bio, location, website, twitter, instagram, profileImage } = body;

    const updates = {};
    if (nickname     !== undefined) updates.nickname     = String(nickname).slice(0, 40).trim();
    if (bio          !== undefined) updates.bio          = String(bio).slice(0, 300).trim();
    if (location     !== undefined) updates.location     = String(location).slice(0, 80).trim();
    if (website      !== undefined) updates.website      = String(website).slice(0, 200).trim();
    if (twitter      !== undefined) updates.twitter      = String(twitter).slice(0, 50).trim();
    if (instagram    !== undefined) updates.instagram    = String(instagram).slice(0, 50).trim();
    if (profileImage !== undefined) updates.profileImage = profileImage || null;

    if (Object.keys(updates).length === 0) {
      return NextResponse.json({ error: 'No valid fields to update' }, { status: 400 });
    }

    await connectDB();
    const user = await User.findByIdAndUpdate(
      session.user.id,
      { $set: updates },
      { new: true }
    ).select('name email image profileImage nickname bio location website twitter instagram createdAt');

    return NextResponse.json({ user, message: 'Profile updated successfully' });
  } catch (err) {
    console.error('PATCH /api/profile error:', err);
    return NextResponse.json({ error: 'Server error: ' + err.message }, { status: 500 });
  }
}
