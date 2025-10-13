import { NextResponse } from 'next/server';
import { connectToDB } from '@/lib/db';
import Product from '@/models/Product';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/lib/authOptions';

// GET /api/products - Get all products with optional filtering
// Query params: category, search, page, limit, sort, minPrice, maxPrice
export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const category = searchParams.get('category');
    const search = searchParams.get('search');
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '10');
    const sort = searchParams.get('sort') || '-createdAt';
    const minPrice = searchParams.get('minPrice');
    const maxPrice = searchParams.get('maxPrice');

    await connectToDB();

    const query: any = {};
    
    // Filter by category if provided
    if (category) {
      query.category = category;
    }

    // Text search
    if (search) {
      query.$text = { $search: search };
    }

    // Price range filter
    if (minPrice || maxPrice) {
      query.price = {};
      if (minPrice) query.price.$gte = parseFloat(minPrice);
      if (maxPrice) query.price.$lte = parseFloat(maxPrice);
    }

    // Execute query with pagination and sorting
    const products = await Product.find(query)
      .sort(sort)
      .limit(limit)
      .skip((page - 1) * limit)
      .lean();

    // Get total count for pagination
    const total = await Product.countDocuments(query);

    return NextResponse.json({
      success: true,
      data: products,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit),
      },
    });
  } catch (error) {
    console.error('Error fetching products:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch products' },
      { status: 500 }
    );
  }
}

// POST /api/products - Create a new product (admin only)
export async function POST(request: Request) {
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
    
    // Basic validation
    if (!data.name || !data.price || !data.category) {
      return NextResponse.json(
        { success: false, error: 'Missing required fields' },
        { status: 400 }
      );
    }

    await connectToDB();
    
    // Create slug from name
    const slug = data.name
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)/g, '');

    const product = new Product({
      ...data,
      slug,
    });

    await product.save();

    return NextResponse.json(
      { success: true, data: product },
      { status: 201 }
    );
  } catch (error) {
    console.error('Error creating product:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to create product' },
      { status: 500 }
    );
  }
}
