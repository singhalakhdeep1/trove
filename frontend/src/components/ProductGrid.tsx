'use client';

import { useState } from 'react';
import { cn } from '@/lib/utils';
import ProductCard from './ProductCard';

interface ProductGridProps {
  className?: string;
  data?: any;
}

export default function ProductGrid({ className, data }: ProductGridProps) {
  const products = data?.products || [
    { id: '1', name: 'Smart Noise-Cancelling Headphones', price: 299.99, rating: 4.8, reviewsCount: 124, category: 'Electronics' },
    { id: '2', name: 'Ultra-Wide Curved Gaming Monitor', price: 499.00, rating: 4.7, reviewsCount: 89, category: 'Electronics' },
    { id: '3', name: 'Ergonomic Desk Chair', price: 249.50, rating: 4.5, reviewsCount: 210, category: 'Furniture' },
    { id: '4', name: 'Wireless Charging Desk Mat', price: 49.99, rating: 4.6, reviewsCount: 65, category: 'Accessories' },
  ];

  return (
    <div className={cn('py-6', className)}>
      <h2 className="text-2xl font-bold text-gray-900 mb-6">All Products</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {products.map((product: any) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>
    </div>
  );
}
