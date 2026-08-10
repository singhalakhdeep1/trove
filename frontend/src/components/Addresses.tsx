'use client';

import { useState } from 'react';
import { cn } from '@/lib/utils';

interface AddressesProps {
  className?: string;
  data?: any;
}

export default function Addresses({ className, data }: AddressesProps) {
  const addresses = data?.addresses || [
    { id: '1', type: 'Home', street: '123 Market Street, Suite 400', city: 'San Francisco', state: 'CA', zip: '94105' },
    { id: '2', type: 'Work', street: '500 Tech Highway', city: 'Palo Alto', state: 'CA', zip: '94301' },
  ];

  return (
    <div className={cn('p-6 bg-white rounded-lg shadow-sm border border-gray-100 mt-6', className)}>
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-bold text-gray-900">Saved Addresses</h2>
        <button className="text-sm font-medium text-blue-600 hover:text-blue-800">
          + Add New Address
        </button>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {addresses.map((addr: any) => (
          <div key={addr.id} className="p-4 border border-gray-200 rounded-lg">
            <span className="px-2 py-1 text-xs font-bold uppercase bg-gray-100 text-gray-700 rounded">
              {addr.type}
            </span>
            <p className="text-sm font-medium text-gray-900 mt-2">{addr.street}</p>
            <p className="text-sm text-gray-500">{addr.city}, {addr.state} {addr.zip}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
