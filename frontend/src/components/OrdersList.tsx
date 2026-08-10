'use client';

import { useState } from 'react';
import { cn } from '@/lib/utils';

interface OrdersListProps {
  className?: string;
  data?: any;
}

export default function OrdersList({ className, data }: OrdersListProps) {
  const orders = data?.orders || [
    { id: 'ORD-901', date: '2026-08-02', status: 'Delivered', total: '$210.00', itemsCount: 3 },
    { id: 'ORD-902', date: '2026-08-07', status: 'In Transit', total: '$85.40', itemsCount: 1 },
  ];

  return (
    <div className={cn('p-6 bg-white rounded-lg shadow-sm border border-gray-100', className)}>
      <h2 className="text-xl font-bold text-gray-900 mb-4">Your Recent Orders</h2>
      <div className="space-y-4">
        {orders.map((ord: any) => (
          <div key={ord.id} className="p-4 border border-gray-200 rounded-lg flex items-center justify-between">
            <div>
              <p className="font-bold text-gray-900">{ord.id}</p>
              <p className="text-sm text-gray-500">Placed on {ord.date} • {ord.itemsCount} items</p>
            </div>
            <div className="text-right">
              <span className="px-2.5 py-1 text-xs font-semibold bg-blue-100 text-blue-800 rounded-full">
                {ord.status}
              </span>
              <p className="font-bold text-gray-900 mt-1">{ord.total}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
