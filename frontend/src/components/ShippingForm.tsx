'use client';

import { useState } from 'react';
import { cn } from '@/lib/utils';

interface ShippingFormProps {
  className?: string;
  data?: any;
}

export default function ShippingForm({ className, data }: ShippingFormProps) {
  return (
    <div className={cn('p-6 bg-white rounded-lg shadow-sm border border-gray-100', className)}>
      <h2 className="text-xl font-bold text-gray-900 mb-4">Shipping Information</h2>
      <form className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-xs font-semibold text-gray-700 uppercase mb-1">First Name</label>
          <input type="text" className="w-full p-2.5 border border-gray-300 rounded-md text-sm" placeholder="John" />
        </div>
        <div>
          <label className="block text-xs font-semibold text-gray-700 uppercase mb-1">Last Name</label>
          <input type="text" className="w-full p-2.5 border border-gray-300 rounded-md text-sm" placeholder="Doe" />
        </div>
        <div className="md:col-span-2">
          <label className="block text-xs font-semibold text-gray-700 uppercase mb-1">Street Address</label>
          <input type="text" className="w-full p-2.5 border border-gray-300 rounded-md text-sm" placeholder="123 Main St" />
        </div>
        <div>
          <label className="block text-xs font-semibold text-gray-700 uppercase mb-1">City</label>
          <input type="text" className="w-full p-2.5 border border-gray-300 rounded-md text-sm" placeholder="San Francisco" />
        </div>
        <div>
          <label className="block text-xs font-semibold text-gray-700 uppercase mb-1">ZIP Code</label>
          <input type="text" className="w-full p-2.5 border border-gray-300 rounded-md text-sm" placeholder="94105" />
        </div>
      </form>
    </div>
  );
}
