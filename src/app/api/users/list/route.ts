import { NextResponse } from 'next/server';
import { connectToDB } from '@/lib/db';
import User from '@/models/User';

export async function GET() {
  if (process.env.NODE_ENV === 'production') {
    return NextResponse.json(
      { error: 'Not allowed in production' },
      { status: 403 }
    );
  }

  try {
    await connectToDB();
    const users = await User.find({}, { password: 0 }); // Exclude passwords
    return NextResponse.json(users);
  } catch (error) {
    console.error('Error fetching users:', error);
    return NextResponse.json(
      { error: 'Failed to fetch users' },
      { status: 500 }
    );
  }
}
