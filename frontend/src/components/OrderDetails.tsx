'use client';

import { useState } from 'react';
import { cn } from '@/lib/utils';

interface OrderDetailsProps {
  className?: string;
  data?: any;
}

export default function OrderDetails({ className, data }: OrderDetailsProps) {
  const order = data?.selectedOrder || {
    id: 'ORD-901',
    status: 'Delivered',
    date: '2026-08-02',
    trackingNumber: 'TRK-984019284',
    carrier: 'FedEx Express',
    shippingAddress: '123 Market Street, San Francisco, CA 94105',
    paymentMethod: 'Visa ending in 4242',
  };

  return (
    <div className={cn('p-6 bg-white rounded-lg shadow-sm border border-gray-100 mt-6', className)}>
      <h2 className="text-xl font-bold text-gray-900 mb-4">Order Details: {order.id}</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
        <div>
          <p className="text-gray-500 font-medium">Tracking Number</p>
          <p className="text-gray-900 font-semibold mt-1">{order.trackingNumber} ({order.carrier})</p>
        </div>
        <div>
          <p className="text-gray-500 font-medium">Payment Method</p>
          <p className="text-gray-900 font-semibold mt-1">{order.paymentMethod}</p>
        </div>
        <div className="md:col-span-2">
          <p className="text-gray-500 font-medium">Shipping Address</p>
          <p className="text-gray-900 font-semibold mt-1">{order.shippingAddress}</p>
        </div>
      </div>
    </div>
  );
}
