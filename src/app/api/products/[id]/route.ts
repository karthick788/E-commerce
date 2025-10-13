import { NextResponse } from 'next/server';
import { connectToDB } from '@/lib/db';
import Product from '@/models/Product';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/lib/authOptions';

// GET /api/products/[id] - Get a single product by ID or slug
export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    await connectToDB();
    
    // Check if the ID is a valid MongoDB ObjectId
    const isObjectId = /^[0-9a-fA-F]{24}$/.test(params.id);
    
    let product;
    
    if (isObjectId) {
      product = await Product.findById(params.id);
    } else {
      // If not an ObjectId, try to find by slug
      product = await Product.findOne({ slug: params.id });
    }

    if (!product) {
      return NextResponse.json(
        { success: false, error: 'Product not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({ success: true, data: product });
  } catch (error) {
    console.error('Error fetching product:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch product' },
      { status: 500 }
    );
  }
}

// PUT /api/products/[id] - Update a product (admin only)
export async function PUT(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions);
    
    // Check if user is admin
    if (!session?.user || session.user.role !== 'admin') {
      return NextResponse.json(
        { success: false, error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const data = await request.json();
    
    await connectToDB();
    
    // Update slug if name is being updated
    if (data.name) {
      const slug = data.name
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/(^-|-$)/g, '');
      data.slug = slug;
    }

    const product = await Product.findByIdAndUpdate(
      params.id,
      { $set: data },
      { new: true, runValidators: true }
    );

    if (!product) {
      return NextResponse.json(
        { success: false, error: 'Product not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({ success: true, data: product });
  } catch (error) {
    console.error('Error updating product:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to update product' },
      { status: 500 }
    );
  }
}

// DELETE /api/products/[id] - Delete a product (admin only)
export async function DELETE(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions);
    
    // Check if user is admin
    if (!session?.user || session.user.role !== 'admin') {
      return NextResponse.json(
        { success: false, error: 'Unauthorized' },
        { status: 401 }
      );
    }

    await connectToDB();
    
    const product = await Product.findByIdAndDelete(params.id);

    if (!product) {
      return NextResponse.json(
        { success: false, error: 'Product not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({ 
      success: true, 
      message: 'Product deleted successfully' 
    });
  } catch (error) {
    console.error('Error deleting product:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to delete product' },
      { status: 500 }
    );
  }
}
