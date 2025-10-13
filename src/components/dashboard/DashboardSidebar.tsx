// src/components/dashboard/DashboardSidebar.tsx
'use client';

import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { FiHome, FiShoppingBag, FiShoppingCart, FiUser, FiLogOut, FiPackage } from 'react-icons/fi';
import { signOut } from 'next-auth/react';
import { useState } from 'react';

const navItems = [
  { name: 'Dashboard', href: '/', icon: FiHome },
  { name: 'Products', href: '/products', icon: FiShoppingBag },
  { name: 'Cart', href: '/cart', icon: FiShoppingCart },
  { name: 'Orders', href: '/orders', icon: FiPackage },
  { name: 'Profile', href: '/profile', icon: FiUser },
];

export default function DashboardSidebar() {
  const pathname = usePathname();
  const router = useRouter();
  const [isSigningOut, setIsSigningOut] = useState(false);

  const handleSignOut = async () => {
    try {
      setIsSigningOut(true);
      await signOut({ 
        callbackUrl: '/login',
        redirect: true 
      });
    } catch (error) {
      console.error('Sign out error:', error);
      // Force redirect to login if signOut fails
      router.push('/login');
    } finally {
      setIsSigningOut(false);
    }
  };

  return (
    <div className="w-64 bg-white shadow-lg">
      <div className="p-4 border-b">
        <h2 className="text-xl font-semibold text-gray-800">Dashboard</h2>
      </div>
      <nav className="p-4">
        <ul className="space-y-2">
          {navItems.map((item) => {
            const isActive = pathname === item.href;
            return (
              <li key={item.name}>
                <Link
                  href={item.href}
                  className={`flex items-center p-3 rounded-lg transition-colors ${
                    isActive 
                      ? 'bg-blue-50 text-blue-600' 
                      : 'text-gray-600 hover:bg-gray-100'
                  }`}
                >
                  <item.icon className="w-5 h-5 mr-3" />
                  <span>{item.name}</span>
                </Link>
              </li>
            );
          })}
          <li className="mt-8 pt-4 border-t border-gray-100">
            <button
              onClick={handleSignOut}
              disabled={isSigningOut}
              className={`flex items-center w-full p-3 rounded-lg transition-colors ${
                isSigningOut 
                  ? 'text-red-400 cursor-not-allowed' 
                  : 'text-red-600 hover:bg-red-50'
              }`}
            >
              <FiLogOut className="w-5 h-5 mr-3" />
              <span>{isSigningOut ? 'Signing Out...' : 'Sign Out'}</span>
            </button>
          </li>
        </ul>
      </nav>
    </div>
  );
}