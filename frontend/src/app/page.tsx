'use client';

import { useEffect, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Hero from '@/components/Hero';
import FeaturedProducts from '@/components/FeaturedProducts';
import Categories from '@/components/Categories';
import Deals from '@/components/Deals';
import Testimonials from '@/components/Testimonials';

export default function HomePage() {
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
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/home`);
      const result = await response.json();
      setData(result);
    } catch (err: any) {
      setData({
        slides: [
          { title: 'Welcome to Marketplace', subtitle: 'Discover amazing products from sellers worldwide', image: '/images/hero1.jpg', cta: 'Shop Now', link: '/products' },
          { title: 'Fast Delivery', subtitle: 'Get your orders delivered to your doorstep', image: '/images/hero2.jpg', cta: 'Learn More', link: '/services' },
          { title: 'Best Prices', subtitle: 'Compare prices and find the best deals', image: '/images/hero3.jpg', cta: 'Browse Deals', link: '/deals' },
        ],
        products: [
          { id: 'p1', name: 'Wireless Headphones', price: 99.99, image: '/products/headphones.jpg', slug: 'wireless-headphones', rating: 4.8 },
          { id: 'p2', name: 'Smart Watch', price: 149.99, image: '/products/watch.jpg', slug: 'smart-watch', rating: 4.7 },
          { id: 'p3', name: 'Gaming Mouse', price: 59.99, image: '/products/mouse.jpg', slug: 'gaming-mouse', rating: 4.6 },
          { id: 'p4', name: 'Bluetooth Speaker', price: 79.99, image: '/products/speaker.jpg', slug: 'bluetooth-speaker', rating: 4.8 },
        ],
        categories: [
          { id: '1', name: 'Electronics', image: '/images/electronics.jpg', productCount: 1250 },
          { id: '2', name: 'Fashion', image: '/images/fashion.jpg', productCount: 2340 },
          { id: '3', name: 'Home & Garden', image: '/images/home.jpg', productCount: 890 },
          { id: '4', name: 'Sports', image: '/images/sports.jpg', productCount: 567 },
          { id: '5', name: 'Books', image: '/images/books.jpg', productCount: 3450 },
          { id: '6', name: 'Toys', image: '/images/toys.jpg', productCount: 678 },
        ],
        deals: [
          { id: '1', title: 'Summer Sale', originalPrice: 99.99, discountedPrice: 49.99, discount: 50, image: '/images/deal1.jpg' },
          { id: '2', title: 'Flash Deal', originalPrice: 149.99, discountedPrice: 79.99, discount: 47, image: '/images/deal2.jpg' },
          { id: '3', title: 'Weekend Special', originalPrice: 199.99, discountedPrice: 99.99, discount: 50, image: '/images/deal3.jpg' },
        ],
        testimonials: [
          { id: '1', name: 'Sarah Johnson', role: 'Verified Buyer', avatar: '/images/avatar1.jpg', content: 'Amazing products and fast delivery!', rating: 5 },
          { id: '2', name: 'Michael Chen', role: 'Verified Buyer', avatar: '/images/avatar2.jpg', content: 'Great selection and competitive prices.', rating: 5 },
          { id: '3', name: 'Emily Davis', role: 'Verified Buyer', avatar: '/images/avatar3.jpg', content: 'Love the variety of products available.', rating: 4 },
        ],
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
          <h1 className="text-3xl font-bold text-gray-900">Home</h1>
          <p className="mt-2 text-sm text-gray-600">
            Welcome to the Home page
          </p>
        </div>
      </div>

      {/* Page Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Hero data={data} />
        <FeaturedProducts data={data} />
        <Categories data={data} />
        <Deals data={data} />
        <Testimonials data={data} />
      </div>
    </div>
  );
}
