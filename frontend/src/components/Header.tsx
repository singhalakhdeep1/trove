'use client';

import { useState } from 'react';
import { cn } from '@/lib/utils';
import { useRouter } from 'next/navigation';
import { useAuthStore } from '@/store/auth.store';
import { useCartStore } from '@/store/cart.store';
import AuthModal from './AuthModal';

interface HeaderProps {
  className?: string;
}

export default function Header({ className }: HeaderProps) {
  const router = useRouter();
  const { user, logout } = useAuthStore();
  const { items } = useCartStore();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  const cartItemCount = items.reduce((sum, item) => sum + item.quantity, 0);

  const handleLogout = () => {
    logout();
    setIsMenuOpen(false);
    router.push('/');
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      router.push(`/products?search=${encodeURIComponent(searchQuery)}`);
      setSearchQuery('');
    }
  };

  return (
    <>
      <header className={cn('bg-white shadow-sm sticky top-0 z-40 border-b border-gray-100', className)}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            {/* Logo */}
            <div className="flex items-center space-x-2">
              <button
                onClick={() => router.push('/')}
                className="text-2xl font-extrabold text-blue-600 tracking-tight"
              >
                Trove<span className="text-gray-900">App</span>
              </button>
            </div>

            {/* Search Bar */}
            <div className="hidden md:flex flex-1 max-w-lg mx-8">
              <form onSubmit={handleSearch} className="relative w-full">
                <input
                  type="text"
                  placeholder="Search products, services, food, hotels..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
                />
                <button
                  type="submit"
                  className="absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-blue-600"
                >
                  🔍
                </button>
              </form>
            </div>

            {/* Navigation Links */}
            <nav className="hidden md:flex items-center space-x-6 text-sm font-semibold text-gray-700">
              <button onClick={() => router.push('/products')} className="hover:text-blue-600">
                Products
              </button>
              <button onClick={() => router.push('/services')} className="hover:text-blue-600">
                Services
              </button>
              <button onClick={() => router.push('/restaurants')} className="hover:text-blue-600">
                Food
              </button>
              <button onClick={() => router.push('/travel/hotels')} className="hover:text-blue-600">
                Travel
              </button>
            </nav>

            {/* Actions */}
            <div className="flex items-center space-x-4">
              {/* Cart */}
              <button
                onClick={() => router.push('/cart')}
                className="relative text-gray-700 hover:text-blue-600 p-2"
                title="Shopping Cart"
              >
                🛒
                {cartItemCount > 0 && (
                  <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center">
                    {cartItemCount}
                  </span>
                )}
              </button>

              {/* User Account / Auth */}
              {user ? (
                <div className="relative">
                  <button
                    onClick={() => setIsMenuOpen(!isMenuOpen)}
                    className="flex items-center space-x-2 text-gray-700 hover:text-blue-600 font-medium text-sm"
                  >
                    <div className="w-8 h-8 bg-blue-600 text-white font-bold rounded-full flex items-center justify-center">
                      {(user.name || user.email || 'U')[0].toUpperCase()}
                    </div>
                    <span className="hidden sm:inline">{user.name || user.email.split('@')[0]}</span>
                  </button>

                  {isMenuOpen && (
                    <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-xl py-2 border border-gray-100 text-sm z-50">
                      <button
                        onClick={() => { router.push('/profile'); setIsMenuOpen(false); }}
                        className="block w-full text-left px-4 py-2 text-gray-700 hover:bg-gray-50"
                      >
                        Profile
                      </button>
                      <button
                        onClick={() => { router.push('/orders'); setIsMenuOpen(false); }}
                        className="block w-full text-left px-4 py-2 text-gray-700 hover:bg-gray-50"
                      >
                        My Orders
                      </button>
                      {user.role === 'SELLER' && (
                        <button
                          onClick={() => { router.push('/seller'); setIsMenuOpen(false); }}
                          className="block w-full text-left px-4 py-2 text-blue-600 font-semibold hover:bg-gray-50"
                        >
                          Seller Dashboard
                        </button>
                      )}
                      {user.role === 'ADMIN' && (
                        <button
                          onClick={() => { router.push('/admin'); setIsMenuOpen(false); }}
                          className="block w-full text-left px-4 py-2 text-purple-600 font-semibold hover:bg-gray-50"
                        >
                          Admin Panel
                        </button>
                      )}
                      <div className="border-t border-gray-100 my-1"></div>
                      <button
                        onClick={handleLogout}
                        className="block w-full text-left px-4 py-2 text-red-600 font-semibold hover:bg-gray-50"
                      >
                        Sign Out
                      </button>
                    </div>
                  )}
                </div>
              ) : (
                <button
                  onClick={() => setIsAuthModalOpen(true)}
                  className="px-4 py-2 bg-blue-600 text-white font-semibold text-sm rounded-lg hover:bg-blue-700 transition-colors"
                >
                  Sign In
                </button>
              )}
            </div>
          </div>
        </div>
      </header>

      {/* Auth Modal */}
      <AuthModal
        isOpen={isAuthModalOpen}
        onClose={() => setIsAuthModalOpen(false)}
      />
    </>
  );
}
