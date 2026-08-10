'use client';

import { useState } from 'react';
import { cn } from '@/lib/utils';

interface OrderSummaryProps {
  className?: string;
  data?: any;
}

export default function OrderSummary({ className, data }: OrderSummaryProps) {
  const subtotal = data?.subtotal || 299.99;
  const shipping = data?.shipping || 10.00;
  const total = subtotal + shipping;

  return (
    <div className={cn('p-6 bg-white rounded-lg shadow-sm border border-gray-100 mt-6', className)}>
      <h2 className="text-xl font-bold text-gray-900 mb-4">Checkout Summary</h2>
      <div className="space-y-2 text-sm">
        <div className="flex justify-between text-gray-600">
          <span>Items Total</span>
          <span className="font-semibold text-gray-900">${subtotal.toFixed(2)}</span>
        </div>
        <div className="flex justify-between text-gray-600">
          <span>Shipping Fee</span>
          <span className="font-semibold text-gray-900">${shipping.toFixed(2)}</span>
        </div>
        <div className="border-t border-gray-200 pt-2 flex justify-between text-base font-bold text-gray-900">
          <span>Total Amount</span>
          <span className="text-blue-600">${total.toFixed(2)}</span>
        </div>
      </div>
      <button className="w-full mt-6 py-3 bg-green-600 text-white font-bold rounded-lg hover:bg-green-700 transition-colors">
        Complete Purchase
      </button>
    </div>
  );
}
