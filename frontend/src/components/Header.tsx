'use client';

import { useState, useEffect } from 'react';
import { cn } from '@/lib/utils';
import { useRouter } from 'next/navigation';
import { useAuthStore } from '@/store/auth.store';
import { useCartStore } from '@/store/cart.store';

interface HeaderProps {
  className?: string;
}

export default function Header({ className }: HeaderProps) {
  const router = useRouter();
  const { user, logout } = useAuthStore();
  const { items } = useCartStore();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  const cartItemCount = items.reduce((sum, item) => sum + item.quantity, 0);

  const handleLogout = async () => {
    await logout();
    router.push('/login');
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      router.push(`/products?search=${encodeURIComponent(searchQuery)}`);
      setIsSearchOpen(false);
      setSearchQuery('');
    }
  };

  return (
    <header className={cn('bg-white shadow-sm sticky top-0 z-50', className)}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <div className="flex items-center">
            <button
              onClick={() => router.push('/')}
              className="text-2xl font-bold text-blue-600"
            >
              MarketPlace
            </button>
          </div>

          {/* Search Bar */}
          <div className="hidden md:flex flex-1 max-w-lg mx-8">
            <form onSubmit={handleSearch} className="relative w-full">
              <input
                type="text"
                placeholder="Search products..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
              <button
                type="submit"
                className="absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </button>
            </form>
          </div>

          {/* Navigation */}
          <nav className="hidden md:flex items-center space-x-6">
            <button
              onClick={() => router.push('/products')}
              className="text-gray-700 hover:text-blue-600 font-medium"
            >
              Products
            </button>
            <button
              onClick={() => router.push('/services')}
              className="text-gray-700 hover:text-blue-600 font-medium"
            >
              Services
            </button>
            <button
              onClick={() => router.push('/restaurants')}
              className="text-gray-700 hover:text-blue-600 font-medium"
            >
              Food
            </button>
            <button
              onClick={() => router.push('/travel/hotels')}
              className="text-gray-700 hover:text-blue-600 font-medium"
            >
              Travel
            </button>
          </nav>

          {/* Right Icons */}
          <div className="flex items-center space-x-4">
            {/* Cart */}
            <button
              onClick={() => router.push('/cart')}
              className="relative text-gray-700 hover:text-blue-600"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
              </svg>
              {cartItemCount > 0 && (
                <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                  {cartItemCount}
                </span>
              )}
            </button>

            {/* User Menu */}
            {user ? (
              <div className="relative">
                <button
                  onClick={() => setIsMenuOpen(!isMenuOpen)}
                  className="flex items-center space-x-2 text-gray-700 hover:text-blue-600"
                >
                  <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center text-white font-semibold">
                    {user.firstName?.[0] || 'U'}
                  </div>
                </button>

                {isMenuOpen && (
                  <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg py-2">
                    <button
                      onClick={() => {
                        router.push('/dashboard/profile');
                        setIsMenuOpen(false);
                      }}
                      className="block w-full text-left px-4 py-2 text-gray-700 hover:bg-gray-100"
                    >
                      Profile
                    </button>
                    {user.role === 'SELLER' && (
                      <button
                        onClick={() => {
                          router.push('/dashboard/seller');
                          setIsMenuOpen(false);
                        }}
                        className="block w-full text-left px-4 py-2 text-gray-700 hover:bg-gray-100"
                      >
                        Seller Dashboard
                      </button>
                    )}
                    {user.role === 'ADMIN' && (
                      <button
                        onClick={() => {
                          router.push('/dashboard/admin');
                          setIsMenuOpen(false);
                        }}
                        className="block w-full text-left px-4 py-2 text-gray-700 hover:bg-gray-100"
                      >
                        Admin Panel
                      </button>
                    )}
                    <button
                      onClick={() => {
                        router.push('/dashboard/orders');
                        setIsMenuOpen(false);
                      }}
                      className="block w-full text-left px-4 py-2 text-gray-700 hover:bg-gray-100"
                    >
                      Orders
                    </button>
                    <hr className="my-2" />
                    <button
                      onClick={handleLogout}
                      className="block w-full text-left px-4 py-2 text-red-600 hover:bg-gray-100"
                    >
                      Logout
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <button
                onClick={() => router.push('/login')}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-medium"
              >
                Login
              </button>
            )}

            {/* Mobile Menu Button */}
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="md:hidden text-gray-700"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <div className="md:hidden py-4 border-t">
            <form onSubmit={handleSearch} className="mb-4">
              <input
                type="text"
                placeholder="Search products..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              />
            </form>
            <nav className="flex flex-col space-y-2">
              <button
                onClick={() => {
                  router.push('/products');
                  setIsMenuOpen(false);
                }}
                className="text-left px-4 py-2 text-gray-700 hover:bg-gray-100 rounded"
              >
                Products
              </button>
              <button
                onClick={() => {
                  router.push('/services');
                  setIsMenuOpen(false);
                }}
                className="text-left px-4 py-2 text-gray-700 hover:bg-gray-100 rounded"
              >
                Services
              </button>
              <button
                onClick={() => {
                  router.push('/restaurants');
                  setIsMenuOpen(false);
                }}
                className="text-left px-4 py-2 text-gray-700 hover:bg-gray-100 rounded"
              >
                Food
              </button>
              <button
                onClick={() => {
                  router.push('/travel/hotels');
                  setIsMenuOpen(false);
                }}
                className="text-left px-4 py-2 text-gray-700 hover:bg-gray-100 rounded"
              >
                Travel
              </button>
            </nav>
          </div>
        )}
      </div>
    </header>
  );
}
