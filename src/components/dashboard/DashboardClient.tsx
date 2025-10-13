'use client';

import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { FiShoppingBag, FiPackage, FiShoppingCart, FiUser, FiArrowRight, FiPlus } from 'react-icons/fi';
import DashboardLayout from '@/components/dashboard/DashboardLayout';
import { useEffect, useState } from 'react';
import { useSession } from 'next-auth/react';

export default function DashboardClient() {
  const { data: session } = useSession();
  const isAdmin = session?.user?.role === 'admin';
  const [stats, setStats] = useState<{ totalProducts: number; totalOrders: number; totalRevenue: number } | null>(null);

  useEffect(() => {
    if (!isAdmin) return;
    fetch('/api/admin/stats')
      .then((r) => r.json())
      .then((d) => setStats(d.data || null))
      .catch(() => {});
  }, [isAdmin]);

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
          <Button asChild>
            <Link href="/products">
              <FiPlus className="w-4 h-4 mr-2" />
              Add Product
            </Link>
          </Button>
        </div>

        {isAdmin && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <Card className="p-6 hover:shadow-lg transition-shadow">
              <h3 className="text-lg font-medium text-gray-500">Total Products</h3>
              <p className="mt-2 text-3xl font-bold text-blue-600">{stats?.totalProducts ?? '—'}</p>
            </Card>
            <Card className="p-6 hover:shadow-lg transition-shadow">
              <h3 className="text-lg font-medium text-gray-500">Total Orders</h3>
              <p className="mt-2 text-3xl font-bold text-green-600">{stats?.totalOrders ?? '—'}</p>
            </Card>
            <Card className="p-6 hover:shadow-lg transition-shadow">
              <h3 className="text-lg font-medium text-gray-500">Total Revenue</h3>
              <p className="mt-2 text-3xl font-bold text-purple-600">{stats ? `$${stats.totalRevenue.toFixed(2)}` : '—'}</p>
            </Card>
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <Card className="p-6 hover:shadow-lg transition-shadow group cursor-pointer">
            <Link href="/products" className="block">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-lg font-medium text-gray-900">Manage Products</h3>
                  <p className="text-sm text-gray-500 mt-1">View and edit your products</p>
                </div>
                <FiShoppingBag className="w-8 h-8 text-blue-600 group-hover:scale-110 transition-transform" />
              </div>
              <div className="flex items-center mt-4 text-blue-600 group-hover:text-blue-700">
                <span className="text-sm font-medium">Go to Products</span>
                <FiArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
              </div>
            </Link>
          </Card>
          
          <Card className="p-6 hover:shadow-lg transition-shadow group cursor-pointer">
            <Link href="/cart" className="block">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-lg font-medium text-gray-900">Shopping Cart</h3>
                  <p className="text-sm text-gray-500 mt-1">View your cart items</p>
                </div>
                <FiShoppingCart className="w-8 h-8 text-green-600 group-hover:scale-110 transition-transform" />
              </div>
              <div className="flex items-center mt-4 text-green-600 group-hover:text-green-700">
                <span className="text-sm font-medium">View Cart</span>
                <FiArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
              </div>
            </Link>
          </Card>
          
          <Card className="p-6 hover:shadow-lg transition-shadow group cursor-pointer">
            <Link href="/orders" className="block">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-lg font-medium text-gray-900">Order History</h3>
                  <p className="text-sm text-gray-500 mt-1">Track your orders</p>
                </div>
                <FiPackage className="w-8 h-8 text-purple-600 group-hover:scale-110 transition-transform" />
              </div>
              <div className="flex items-center mt-4 text-purple-600 group-hover:text-purple-700">
                <span className="text-sm font-medium">View Orders</span>
                <FiArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
              </div>
            </Link>
          </Card>
          
          <Card className="p-6 hover:shadow-lg transition-shadow group cursor-pointer">
            <Link href="/profile" className="block">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-lg font-medium text-gray-900">Profile Settings</h3>
                  <p className="text-sm text-gray-500 mt-1">Manage your account</p>
                </div>
                <FiUser className="w-8 h-8 text-orange-600 group-hover:scale-110 transition-transform" />
              </div>
              <div className="flex items-center mt-4 text-orange-600 group-hover:text-orange-700">
                <span className="text-sm font-medium">Edit Profile</span>
                <FiArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
              </div>
            </Link>
          </Card>
        </div>
      </div>
    </DashboardLayout>
  );
}





