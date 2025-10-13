import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/authOptions';
import { connectToDB } from '@/lib/db';
import User from '@/models/User';
import { hash } from 'bcryptjs';

export async function GET() {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    await connectToDB();
    
    const user = await User.findById(session.user.id).select('-password');
    
    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    return NextResponse.json({
      id: user._id,
      firstName: user.firstName || user.name?.split(' ')[0] || '',
      lastName: user.lastName || user.name?.split(' ').slice(1).join(' ') || '',
      email: user.email,
      name: user.name,
      image: user.image || '',
      address: user.address || {},
      wishlist: user.wishlist || [],
    });
  } catch (error) {
    console.error('Error fetching user profile:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function PATCH(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const { firstName, lastName, email, image, address, wishlist, currentPassword, newPassword } = body;

    await connectToDB();
    
    const user = await User.findById(session.user.id);
    
    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    // Update basic profile information
    const updateData: any = {
      firstName: firstName || user.firstName,
      lastName: lastName || user.lastName,
      email: email || user.email,
      name: `${firstName || user.firstName} ${lastName || user.lastName}`.trim(),
      image: image ?? user.image,
      address: address ? { ...user.address?.toObject?.(), ...address } : user.address,
    };

    // Handle password change if provided
    if (currentPassword && newPassword) {
      const isPasswordValid = await user.comparePassword?.(currentPassword);
      if (!isPasswordValid) {
        return NextResponse.json({ error: 'Current password is incorrect' }, { status: 400 });
      }
      
      if (newPassword.length < 6) {
        return NextResponse.json({ error: 'New password must be at least 6 characters' }, { status: 400 });
      }
      
      updateData.password = await hash(newPassword, 12);
    }

    if (Array.isArray(wishlist)) {
      updateData.wishlist = wishlist;
    }

    const updatedUser = await User.findByIdAndUpdate(
      session.user.id,
      updateData,
      { new: true, runValidators: true }
    ).select('-password');

    return NextResponse.json({
      message: 'Profile updated successfully',
      user: {
        id: updatedUser._id,
        firstName: updatedUser.firstName,
        lastName: updatedUser.lastName,
        email: updatedUser.email,
        name: updatedUser.name,
        ,
        image: updatedUser.image,
        address: updatedUser.address,
        wishlist: updatedUser.wishlist,
      }
    });
  } catch (error) {
    console.error('Error updating user profile:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}