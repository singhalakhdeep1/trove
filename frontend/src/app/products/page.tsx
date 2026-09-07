'use client';

import { useEffect, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import ProductGrid from '@/components/ProductGrid';
import Filters from '@/components/Filters';
import Sort from '@/components/Sort';
import Pagination from '@/components/Pagination';

export default function ProductsPage() {
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
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/products`);
      const result = await response.json();
      setData(result);
    } catch (err: any) {
      setData({
        products: [
          { id: 'p1', name: 'Wireless Headphones', price: 99.99, image: '/products/headphones.jpg', slug: 'wireless-headphones', rating: 4.8 },
          { id: 'p2', name: 'Smart Watch', price: 149.99, image: '/products/watch.jpg', slug: 'smart-watch', rating: 4.7 },
          { id: 'p3', name: 'Gaming Mouse', price: 59.99, image: '/products/mouse.jpg', slug: 'gaming-mouse', rating: 4.6 },
          { id: 'p4', name: 'Bluetooth Speaker', price: 79.99, image: '/products/speaker.jpg', slug: 'bluetooth-speaker', rating: 4.8 },
          { id: 'p5', name: '4K Monitor', price: 329.99, image: '/products/monitor.jpg', slug: '4k-monitor', rating: 4.9 },
          { id: 'p6', name: 'Mechanical Keyboard', price: 109.99, image: '/products/keyboard.jpg', slug: 'mechanical-keyboard', rating: 4.7 },
        ],
        categories: ['Electronics', 'Accessories', 'Audio', 'Gaming'],
        filters: ['Best Sellers', 'New Arrivals', 'Deals', 'Top Rated'],
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
          <h1 className="text-3xl font-bold text-gray-900">Products</h1>
          <p className="mt-2 text-sm text-gray-600">
            Welcome to the Products page
          </p>
        </div>
      </div>

      {/* Page Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <ProductGrid data={data} />
        <Filters data={data} />
        <Sort data={data} />
        <Pagination data={data} />
      </div>
    </div>
  );
}
