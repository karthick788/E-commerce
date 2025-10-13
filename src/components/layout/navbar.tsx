// src/components/layout/navbar.tsx
'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { FiSearch, FiShoppingCart, FiUser, FiMenu, FiX, FiMoon, FiSun } from 'react-icons/fi';
import { useTheme } from 'next-themes';

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [mounted, setMounted] = useState(false);
  const { theme, setTheme } = useTheme();
  const pathname = usePathname();

  useEffect(() => {
    setMounted(true);
  }, []);

  const toggleTheme = () => {
    setTheme(theme === 'dark' ? 'light' : 'dark');
  };

  const navLinks = [
    { name: 'Home', href: '/' },
    { name: 'Dresses', href: '/dresses' },
    { name: 'Mobiles', href: '/mobiles' },
    { name: 'Shoes', href: '/shoes' },
    { name: 'Furniture', href: '/furniture' },
  ];

  if (!mounted) return null;

  return (
    <nav className="bg-white dark:bg-gray-900 shadow-sm sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <Link href="/" className="flex-shrink-0 flex items-center">
              <span className="text-xl font-bold text-primary-600 dark:text-primary-400">
                AI Shop
              </span>
            </Link>
          </div>

          <div className="hidden md:ml-6 md:flex md:items-center md:space-x-8">
            {navLinks.map((link) => (
              <Link
                key={link.name}
                href={link.href}
                className={`${
                  pathname === link.href
                    ? 'border-primary-500 text-gray-900 dark:text-white'
                    : 'border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700 dark:text-gray-300 dark:hover:text-white'
                } inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium`}
              >
                {link.name}
              </Link>
            ))}
          </div>

          <div className="flex items-center">
            <div className="flex-shrink-0 flex items-center">
              <button className="p-2 rounded-full text-gray-400 hover:text-gray-500 dark:hover:text-gray-300 focus:outline-none">
                <FiSearch className="h-6 w-6" />
              </button>

              <button
                onClick={toggleTheme}
                className="p-2 rounded-full text-gray-400 hover:text-gray-500 dark:hover:text-gray-300 focus:outline-none"
              >
                {theme === 'dark' ? (
                  <FiSun className="h-6 w-6" />
                ) : (
                  <FiMoon className="h-6 w-6" />
                )}
              </button>

              <Link
                href="/cart"
                className="p-2 rounded-full text-gray-400 hover:text-gray-500 dark:hover:text-gray-300 focus:outline-none relative"
              >
                <FiShoppingCart className="h-6 w-6" />
                <span className="absolute top-0 right-0 inline-flex items-center justify-center px-2 py-1 text-xs font-bold leading-none text-white transform translate-x-1/2 -translate-y-1/2 bg-red-500 rounded-full">
                  0
                </span>
              </Link>

              <Link
                href="/login"
                className="p-2 rounded-full text-gray-400 hover:text-gray-500 dark:hover:text-gray-300 focus:outline-none"
              >
                <FiUser className="h-6 w-6" />
              </Link>

              <div className="md:hidden">
                <button
                  onClick={() => setIsOpen(!isOpen)}
                  className="inline-flex items-center justify-center p-2 rounded-md text-gray-400 hover:text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-800 focus:outline-none"
                >
                  {isOpen ? (
                    <FiX className="block h-6 w-6" />
                  ) : (
                    <FiMenu className="block h-6 w-6" />
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {isOpen && (
        <div className="md:hidden">
          <div className="pt-2 pb-3 space-y-1">
            {navLinks.map((link) => (
              <Link
                key={link.name}
                href={link.href}
                className={`${
                  pathname === link.href
                    ? 'bg-primary-50 border-primary-500 text-primary-700 dark:bg-gray-800'
                    : 'border-transparent text-gray-600 hover:bg-gray-50 hover:border-gray-300 hover:text-gray-800 dark:text-gray-300 dark:hover:bg-gray-700'
                } block pl-3 pr-4 py-2 border-l-4 text-base font-medium`}
                onClick={() => setIsOpen(false)}
              >
                {link.name}
              </Link>
            ))}
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;