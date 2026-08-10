'use client';

import { useState } from 'react';
import { cn } from '@/lib/utils';

interface CartItemsProps {
  className?: string;
  data?: any;
}

export default function CartItems({ className, data }: CartItemsProps) {
  const items = data?.items || [
    { id: '1', name: 'Premium Noise Cancelling Headphones', price: 199.99, quantity: 1, image: '/placeholder.jpg' },
    { id: '2', name: 'Wireless Mechanical Keyboard', price: 129.50, quantity: 2, image: '/placeholder.jpg' },
  ];

  return (
    <div className={cn('p-6 bg-white rounded-lg shadow-sm border border-gray-100', className)}>
      <h2 className="text-xl font-bold text-gray-900 mb-4">Cart Items ({items.length})</h2>
      <div className="divide-y divide-gray-200">
        {items.map((item: any) => (
          <div key={item.id} className="py-4 flex items-center justify-between">
            <div>
              <p className="font-semibold text-gray-900">{item.name}</p>
              <p className="text-sm text-gray-500">Qty: {item.quantity}</p>
            </div>
            <div className="text-right">
              <p className="font-bold text-gray-900">${(item.price * item.quantity).toFixed(2)}</p>
              <button className="text-xs text-red-600 hover:underline mt-1">Remove</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
