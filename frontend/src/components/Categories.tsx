'use client';

import { useState, useEffect } from 'react';
import { cn } from '@/lib/utils';
import { useRouter } from 'next/navigation';

interface Category {
  id: string;
  name: string;
  image: string;
  productCount: number;
}

interface CategoriesProps {
  className?: string;
  data?: any;
}

export default function Categories({ className, data }: CategoriesProps) {
  const router = useRouter();
  const [categories, setCategories] = useState<Category[]>(data?.categories || []);
  const [loading, setLoading] = useState(!data);

  useEffect(() => {
    if (!data) {
      // Mock data for now
      setCategories([
        { id: '1', name: 'Electronics', image: '/images/electronics.jpg', productCount: 1250 },
        { id: '2', name: 'Fashion', image: '/images/fashion.jpg', productCount: 2340 },
        { id: '3', name: 'Home & Garden', image: '/images/home.jpg', productCount: 890 },
        { id: '4', name: 'Sports', image: '/images/sports.jpg', productCount: 567 },
        { id: '5', name: 'Books', image: '/images/books.jpg', productCount: 3450 },
        { id: '6', name: 'Toys', image: '/images/toys.jpg', productCount: 678 },
      ]);
      setLoading(false);
    }
  }, [data]);

  if (loading) {
    return (
      <div className={cn('py-8', className)}>
        <h2 className="text-2xl font-bold text-gray-900 mb-6">Shop by Category</h2>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
          {[...Array(6)].map((_, i) => (
            <div key={i} className="bg-gray-200 rounded-lg h-32 animate-pulse" />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className={cn('py-8', className)}>
      <h2 className="text-2xl font-bold text-gray-900 mb-6">Shop by Category</h2>
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
        {categories.map((category) => (
          <button
            key={category.id}
            onClick={() => router.push(`/products?category=${category.id}`)}
            className="relative group overflow-hidden rounded-lg aspect-square"
          >
            <img
              src={category.image}
              alt={category.name}
              className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
            <div className="absolute bottom-0 left-0 right-0 p-3">
              <h3 className="text-white font-semibold text-sm">{category.name}</h3>
              <p className="text-white/80 text-xs">{category.productCount} products</p>
            </div>
          </button>
        ))}
      </div>
    </div>
  );
}