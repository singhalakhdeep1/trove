'use client';

import { useState } from 'react';
import { cn } from '@/lib/utils';

interface RecommendationsProps {
  className?: string;
  data?: any;
}

export default function Recommendations({ className, data }: RecommendationsProps) {
  const recommendations = data?.recommendations || [
    { id: '101', name: 'USB-C Fast Charging Hub', price: '$49.99' },
    { id: '102', name: 'Protective Carrying Case', price: '$24.50' },
    { id: '103', name: 'Screen Cleaning Kit', price: '$12.99' },
  ];

  return (
    <div className={cn('p-6 bg-white rounded-lg shadow-sm border border-gray-100 mt-6', className)}>
      <h2 className="text-xl font-bold text-gray-900 mb-4">Recommended for You</h2>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {recommendations.map((item: any) => (
          <div key={item.id} className="p-4 border border-gray-100 rounded-lg hover:shadow-md transition-shadow">
            <p className="font-semibold text-gray-900">{item.name}</p>
            <p className="text-sm font-bold text-blue-600 mt-1">{item.price}</p>
            <button className="mt-3 px-3 py-1.5 bg-gray-100 text-gray-800 text-xs font-semibold rounded hover:bg-gray-200">
              Add to Cart
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
