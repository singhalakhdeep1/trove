'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { cn } from '@/lib/utils';
import Image from 'next/image';

interface WishlistItem {
  id: string;
  productId: string;
  name: string;
  image: string;
  price: number;
  originalPrice?: number;
  inStock: boolean;
  sellerName: string;
  addedAt: string;
}

interface WishlistProps {
  className?: string;
}

export default function Wishlist({ className }: WishlistProps) {
  const router = useRouter();
  const [items, setItems] = useState<WishlistItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchWishlist();
  }, []);

  const fetchWishlist = async () => {
    try {
      // TODO: Replace with actual API call
      // const response = await fetch('/api/wishlist');
      // const data = await response.json();
      // setItems(data);
      
      // Mock data for now
      setItems([
        {
          id: '1',
          productId: 'p1',
          name: 'Wireless Headphones',
          image: '/products/headphones.jpg',
          price: 99.99,
          originalPrice: 149.99,
          inStock: true,
          sellerName: 'TechStore Inc',
          addedAt: '2024-01-15T10:00:00Z',
        },
        {
          id: '2',
          productId: 'p2',
          name: 'Smart Watch',
          image: '/products/watch.jpg',
          price: 149.99,
          inStock: true,
          sellerName: 'GadgetHub',
          addedAt: '2024-01-14T15:30:00Z',
        },
        {
          id: '3',
          productId: 'p3',
          name: 'Bluetooth Speaker',
          image: '/products/speaker.jpg',
          price: 79.99,
          originalPrice: 99.99,
          inStock: false,
          sellerName: 'AudioMax',
          addedAt: '2024-01-13T09:00:00Z',
        },
      ]);
    } catch (error) {
      console.error('Error fetching wishlist:', error);
    } finally {
      setLoading(false);
    }
  };

  const removeItem = async (itemId: string) => {
    try {
      // TODO: Replace with actual API call
      // await fetch(`/api/wishlist/${itemId}`, { method: 'DELETE' });
      
      setItems(items.filter(item => item.id !== itemId));
    } catch (error) {
      console.error('Error removing item:', error);
    }
  };

  const moveToCart = async (itemId: string) => {
    try {
      // TODO: Replace with actual API call
      // await fetch(`/api/wishlist/${itemId}/move-to-cart`, { method: 'POST' });
      
      setItems(items.filter(item => item.id !== itemId));
    } catch (error) {
      console.error('Error moving to cart:', error);
    }
  };

  if (loading) {
    return (
      <div className={cn('p-6 bg-white rounded-lg shadow-sm border border-gray-100', className)}>
        <div className="animate-pulse space-y-4">
          <div className="h-6 bg-gray-200 rounded w-1/3"></div>
          <div className="space-y-3">
            {[1, 2, 3].map(i => (
              <div key={i} className="h-24 bg-gray-200 rounded"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={cn('p-6 bg-white rounded-lg shadow-sm border border-gray-100', className)}>
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-bold text-gray-900">
          My Wishlist ({items.length})
        </h2>
        {items.length > 0 && (
          <button
            onClick={() => {
              if (confirm('Clear all items from wishlist?')) {
                setItems([]);
              }
            }}
            className="text-sm text-red-600 hover:text-red-700"
          >
            Clear All
          </button>
        )}
      </div>

      {items.length === 0 ? (
        <div className="text-center py-12">
          <svg className="w-16 h-16 mx-auto text-gray-300 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
          </svg>
          <p className="text-gray-500 mb-4">Your wishlist is empty</p>
          <button
            onClick={() => router.push('/products')}
            className="px-6 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700"
          >
            Browse Products
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {items.map(item => (
            <div key={item.id} className="border rounded-lg p-4 hover:shadow-md transition-shadow">
              <div className="relative mb-3">
                <Image
                  src={item.image}
                  alt={item.name}
                  width={200}
                  height={200}
                  className="w-full h-48 object-cover rounded"
                />
                {!item.inStock && (
                  <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center rounded">
                    <span className="text-white font-medium">Out of Stock</span>
                  </div>
                )}
                <button
                  onClick={() => removeItem(item.id)}
                  className="absolute top-2 right-2 p-2 bg-white rounded-full shadow hover:bg-gray-100"
                >
                  <svg className="w-4 h-4 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>

              <h3 className="font-medium text-gray-900 mb-1">{item.name}</h3>
              <p className="text-sm text-gray-500 mb-2">by {item.sellerName}</p>

              <div className="flex items-center gap-2 mb-3">
                <span className="text-lg font-bold text-gray-900">${item.price.toFixed(2)}</span>
                {item.originalPrice && item.originalPrice > item.price && (
                  <span className="text-sm text-gray-500 line-through">${item.originalPrice.toFixed(2)}</span>
                )}
              </div>

              <div className="flex gap-2">
                <button
                  onClick={() => router.push(`/products/${item.productId}`)}
                  className="flex-1 py-2 border border-indigo-600 text-indigo-600 rounded hover:bg-indigo-50 transition-colors text-sm font-medium"
                >
                  View Details
                </button>
                {item.inStock && (
                  <button
                    onClick={() => moveToCart(item.id)}
                    className="flex-1 py-2 bg-indigo-600 text-white rounded hover:bg-indigo-700 transition-colors text-sm font-medium"
                  >
                    Add to Cart
                  </button>
                )}
              </div>

              <p className="text-xs text-gray-400 mt-2">
                Added {new Date(item.addedAt).toLocaleDateString()}
              </p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
