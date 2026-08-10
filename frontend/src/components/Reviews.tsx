'use client';

import { useState } from 'react';
import { cn } from '@/lib/utils';

interface ReviewsProps {
  className?: string;
  data?: any;
}

export default function Reviews({ className, data }: ReviewsProps) {
  const reviews = data?.reviews || [
    { id: '1', author: 'Mark T.', rating: 5, comment: 'Outstanding sound quality and super comfortable for long flights.', date: '2026-07-28' },
    { id: '2', author: 'Elena R.', rating: 4, comment: 'Great noise cancellation. Battery easily lasts 2 days of heavy use.', date: '2026-08-01' },
  ];

  return (
    <div className={cn('p-6 bg-white rounded-lg shadow-sm border border-gray-100 mt-6', className)}>
      <h2 className="text-xl font-bold text-gray-900 mb-4">Customer Reviews</h2>
      <div className="space-y-4">
        {reviews.map((rev: any) => (
          <div key={rev.id} className="p-4 border-b border-gray-100 last:border-b-0">
            <div className="flex items-center justify-between">
              <span className="font-semibold text-gray-900">{rev.author}</span>
              <span className="text-xs text-gray-500">{rev.date}</span>
            </div>
            <p className="text-yellow-500 text-xs font-bold mt-1">{'★'.repeat(rev.rating)}</p>
            <p className="text-sm text-gray-600 mt-2">{rev.comment}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
