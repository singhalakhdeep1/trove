'use client';

import { useState } from 'react';
import { cn } from '@/lib/utils';

interface CartSummaryProps {
  className?: string;
  data?: any;
}

export default function CartSummary({ className, data }: CartSummaryProps) {
  const subtotal = data?.subtotal || 458.99;
  const shipping = data?.shipping || 15.00;
  const tax = data?.tax || 36.72;
  const total = subtotal + shipping + tax;

  return (
    <div className={cn('p-6 bg-white rounded-lg shadow-sm border border-gray-100 mt-6', className)}>
      <h2 className="text-xl font-bold text-gray-900 mb-4">Order Summary</h2>
      <div className="space-y-2 text-sm">
        <div className="flex justify-between text-gray-600">
          <span>Subtotal</span>
          <span className="font-semibold text-gray-900">${subtotal.toFixed(2)}</span>
        </div>
        <div className="flex justify-between text-gray-600">
          <span>Estimated Shipping</span>
          <span className="font-semibold text-gray-900">${shipping.toFixed(2)}</span>
        </div>
        <div className="flex justify-between text-gray-600">
          <span>Tax</span>
          <span className="font-semibold text-gray-900">${tax.toFixed(2)}</span>
        </div>
        <div className="border-t border-gray-200 pt-2 flex justify-between text-base font-bold text-gray-900">
          <span>Total</span>
          <span>${total.toFixed(2)}</span>
        </div>
      </div>
      <button className="w-full mt-6 py-3 bg-blue-600 text-white font-bold rounded-lg hover:bg-blue-700 transition-colors">
        Proceed to Checkout
      </button>
    </div>
  );
}
