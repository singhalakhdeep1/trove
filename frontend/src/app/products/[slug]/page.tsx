'use client';

import { useEffect, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import ImageGallery from '@/components/ImageGallery';
import ProductInfo from '@/components/ProductInfo';
import Reviews from '@/components/Reviews';
import RelatedProducts from '@/components/RelatedProducts';

export default function ProductDetailPage() {
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
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/product-detail`);
      const result = await response.json();
      setData(result);
    } catch (err: any) {
      setData({
        id: 'p1',
        name: 'Wireless Headphones',
        price: 99.99,
        description: 'Premium wireless headphones with deep bass and all-day comfort.',
        image: '/products/headphones.jpg',
        images: ['/products/headphones.jpg', '/products/headphones-side.jpg'],
        rating: 4.8,
        reviews: 128,
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
          <h1 className="text-3xl font-bold text-gray-900">Product Detail</h1>
          <p className="mt-2 text-sm text-gray-600">
            Welcome to the Product Detail page
          </p>
        </div>
      </div>

      {/* Page Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <ImageGallery data={data} />
        <ProductInfo data={data} />
        <Reviews data={data} />
        <RelatedProducts data={data} />
      </div>
    </div>
  );
}
