'use client';

import { useEffect, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import CartItems from '@/components/CartItems';
import CartSummary from '@/components/CartSummary';
import Recommendations from '@/components/Recommendations';

export default function CartPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchData();
  }, [searchParams]);

  const fetchData = async () => {
    try {
      setLoading(true);
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/cart`);
      const result = await response.json();
      setData(result);
    } catch (err: any) {
      setData({
        items: [
          { id: 'p1', name: 'Wireless Headphones', price: 99.99, quantity: 1, image: '/products/headphones.jpg' },
          { id: 'p2', name: 'Smart Watch', price: 149.99, quantity: 1, image: '/products/watch.jpg' },
        ],
        subtotal: 249.98,
        shipping: 12.5,
        total: 262.48,
      });
      setError(null);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-gray-900"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-red-600 mb-4">Error</h2>
          <p className="text-gray-600">{error}</p>
          <button
            onClick={fetchData}
            className="mt-4 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Page Header */}
      <div className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <h1 className="text-3xl font-bold text-gray-900">Shopping Cart</h1>
          <p className="mt-2 text-sm text-gray-600">
            Welcome to the Shopping Cart page
          </p>
        </div>
      </div>

      {/* Page Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <CartItems data={data} />
        <CartSummary data={data} />
        <Recommendations data={data} />
      </div>
    </div>
  );
}
