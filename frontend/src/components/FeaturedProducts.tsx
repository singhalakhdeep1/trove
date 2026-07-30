'use client';

import { useState, useEffect } from 'react';
import { cn } from '@/lib/utils';
import ProductCard from './ProductCard';
import { ApiService } from '@/lib/api';

interface FeaturedProductsProps {
  className?: string;
  data?: any;
}

export default function FeaturedProducts({ className, data }: FeaturedProductsProps) {
  const [products, setProducts] = useState(data?.products || []);
  const [loading, setLoading] = useState(!data);

  useEffect(() => {
    if (!data) {
      fetchProducts();
    }
  }, [data]);

  const fetchProducts = async () => {
    try {
      setLoading(true);
      const response = await ApiService.getProducts({ featured: true, limit: 8 });
      setProducts(response.data || []);
    } catch (error) {
      console.error('Failed to fetch featured products:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className={cn('py-8', className)}>
        <h2 className="text-2xl font-bold text-gray-900 mb-6">Featured Products</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="bg-gray-200 rounded-lg h-80 animate-pulse" />
          ))}
        </div>
      </div>
    );
  }

  if (products.length === 0) {
    return null;
  }

  return (
    <div className={cn('py-8', className)}>
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold text-gray-900">Featured Products</h2>
        <button className="text-blue-600 hover:text-blue-800 font-medium">
          View All
        </button>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {products.map((product: any) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>
    </div>
  );
}