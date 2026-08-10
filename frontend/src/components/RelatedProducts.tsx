'use client';

import { useState } from 'react';
import { cn } from '@/lib/utils';
import ProductCard from './ProductCard';

interface RelatedProductsProps {
  className?: string;
  data?: any;
}

export default function RelatedProducts({ className, data }: RelatedProductsProps) {
  const products = data?.related || [
    { id: '201', name: 'Wireless Charging Stand', price: 39.99, rating: 4.6, reviewsCount: 88, category: 'Accessories' },
    { id: '202', name: 'Hard Shell Carrying Case', price: 29.99, rating: 4.8, reviewsCount: 45, category: 'Accessories' },
  ];

  return (
    <div className={cn('py-6 mt-6', className)}>
      <h2 className="text-xl font-bold text-gray-900 mb-4">Related Products</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
        {products.map((prod: any) => (
          <ProductCard key={prod.id} product={prod} />
        ))}
      </div>
    </div>
  );
}
