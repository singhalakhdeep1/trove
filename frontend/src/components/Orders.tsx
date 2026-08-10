'use client';

import { useState } from 'react';
import { cn } from '@/lib/utils';

interface OrdersProps {
  className?: string;
  data?: any;
  onAction?: (action: string, data?: any) => void;
}

export default function Orders({ className, data, onAction }: OrdersProps) {
  const orders = data?.orders || [
    { id: 'ORD-101', customer: 'Sarah Connor', total: '$149.99', status: 'Delivered', date: '2026-08-01' },
    { id: 'ORD-102', customer: 'John Doe', total: '$89.50', status: 'Processing', date: '2026-08-05' },
    { id: 'ORD-103', customer: 'Jane Smith', total: '$299.00', status: 'Shipped', date: '2026-08-08' },
  ];

  return (
    <div className={cn('p-6 bg-white rounded-lg shadow-sm border border-gray-100 mt-6', className)}>
      <h2 className="text-xl font-bold text-gray-900 mb-4">Orders Management</h2>
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead>
            <tr>
              <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase">Order ID</th>
              <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase">Customer</th>
              <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase">Total</th>
              <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase">Status</th>
              <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase">Date</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {orders.map((order: any) => (
              <tr key={order.id}>
                <td className="px-4 py-3 text-sm font-medium text-blue-600">{order.id}</td>
                <td className="px-4 py-3 text-sm text-gray-900">{order.customer}</td>
                <td className="px-4 py-3 text-sm text-gray-900 font-semibold">{order.total}</td>
                <td className="px-4 py-3 text-sm text-blue-600 font-medium">{order.status}</td>
                <td className="px-4 py-3 text-sm text-gray-500">{order.date}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
