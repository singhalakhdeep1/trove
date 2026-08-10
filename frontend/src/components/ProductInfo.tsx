'use client';

import { useState } from 'react';
import { cn } from '@/lib/utils';

interface ProductInfoProps {
  className?: string;
  data?: any;
}

export default function ProductInfo({ className, data }: ProductInfoProps) {
  const product = data?.product || {
    name: 'Wireless Noise-Cancelling Headphones',
    price: '$299.99',
    rating: 4.8,
    reviewsCount: 142,
    description: 'High-fidelity audio with active noise cancellation, 30-hour battery life, and comfortable over-ear design.',
    inStock: true,
  };

  return (
    <div className={cn('p-6 bg-white rounded-lg shadow-sm border border-gray-100 mt-6', className)}>
      <h1 className="text-2xl font-bold text-gray-900">{product.name}</h1>
      <div className="flex items-center gap-4 mt-2">
        <span className="text-2xl font-extrabold text-blue-600">{product.price}</span>
        <span className="text-sm text-yellow-500 font-bold">★ {product.rating} ({product.reviewsCount} reviews)</span>
        <span className="text-xs px-2 py-0.5 bg-green-100 text-green-800 font-semibold rounded">
          {product.inStock ? 'In Stock' : 'Out of Stock'}
        </span>
      </div>
      <p className="text-gray-600 mt-4 text-sm leading-relaxed">{product.description}</p>
      <div className="flex gap-4 mt-6">
        <button className="flex-1 py-3 bg-blue-600 text-white font-bold rounded-lg hover:bg-blue-700">
          Add to Cart
        </button>
        <button className="px-6 py-3 border border-gray-300 text-gray-700 font-semibold rounded-lg hover:bg-gray-50">
          Add to Wishlist
        </button>
      </div>
    </div>
  );
}
