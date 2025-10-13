import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/lib/authOptions';
import { connectToDB } from '@/lib/db';
import Product from '@/models/Product';
import Order from '@/models/Order';

export async function GET() {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user || session.user.role !== 'admin') {
      return NextResponse.json({ success: false, error: 'Forbidden' }, { status: 403 });
    }

    await connectToDB();

    const [totalProducts, totalOrders, revenueAgg] = await Promise.all([
      Product.countDocuments({}),
      Order.countDocuments({}),
      Order.aggregate([
        { $group: { _id: null, revenue: { $sum: '$totalPrice' } } },
      ]),
    ]);

    const totalRevenue = revenueAgg?.[0]?.revenue || 0;

    return NextResponse.json({
      success: true,
      data: {
        totalProducts,
        totalOrders,
        totalRevenue,
      },
    });
  } catch (error) {
    console.error('Admin stats error:', error);
    return NextResponse.json({ success: false, error: 'Failed to get stats' }, { status: 500 });
  }
}






