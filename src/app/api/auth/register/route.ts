// In src/app/api/auth/register/route.ts
import { NextResponse } from 'next/server';
import { connectToDB } from '@/lib/db';
import User from '@/models/User';
import bcrypt from 'bcryptjs';

export async function POST(request: Request) {
  try {
    const { name, email, password } = await request.json();
    
    // Basic validation
    if (!name || !email || !password) {
      return NextResponse.json(
        { success: false, error: 'Name, email, and password are required' },
        { status: 400 }
      );
    }

    if (password.length < 8) {
      return NextResponse.json(
        { success: false, error: 'Password must be at least 8 characters' },
        { status: 400 }
      );
    }

    // Connect to database
    await connectToDB();

    // Check if user exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return NextResponse.json(
        { success: false, error: 'Email already in use' },
        { status: 409 }
      );
    }

    // Hash password with higher salt rounds for better security
    console.log('🔑 Hashing password...');
    const saltRounds = 12; // Increased from default 10 for better security
    const salt = await bcrypt.genSalt(saltRounds);
    console.log('🔑 Generated salt:', salt);
    
    const hashedPassword = await bcrypt.hash(password, salt);
    console.log('🔑 Password hashed successfully');
    
    // Verify the hash works
    const isMatch = await bcrypt.compare(password, hashedPassword);
    if (!isMatch) {
      console.error('❌ Password hashing verification failed');
      throw new Error('Error creating user account');
    }

    // Create user
    const user = new User({
      name,
      email,
      password: hashedPassword,
      provider: 'local',
      emailVerified: true,
      role: 'user',
    });

    await user.save();

    return NextResponse.json(
      { success: true, user: { id: user._id, email: user.email, name: user.name } },
      { status: 201 }
    );
  } catch (error: any) {
    console.error('Registration error:', error);
    return NextResponse.json(
      { success: false, error: error.message || 'Internal server error' },
      { status: 500 }
    );
  }
}