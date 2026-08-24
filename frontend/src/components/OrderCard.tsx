'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { cn } from '@/lib/utils';

interface OrderItem {
  id: string;
  name: string;
  image: string;
  quantity: number;
  price: number;
}

interface Order {
  id: string;
  orderNumber: string;
  status: 'PENDING' | 'CONFIRMED' | 'PROCESSING' | 'SHIPPED' | 'DELIVERED' | 'CANCELLED' | 'REFUNDED';
  total: number;
  createdAt: string;
  items: OrderItem[];
}

interface OrderCardProps {
  className?: string;
  order: Order;
}

const statusColors = {
  PENDING: 'bg-yellow-100 text-yellow-800',
  CONFIRMED: 'bg-blue-100 text-blue-800',
  PROCESSING: 'bg-purple-100 text-purple-800',
  SHIPPED: 'bg-indigo-100 text-indigo-800',
  DELIVERED: 'bg-green-100 text-green-800',
  CANCELLED: 'bg-red-100 text-red-800',
  REFUNDED: 'bg-gray-100 text-gray-800',
};

export default function OrderCard({ className, order }: OrderCardProps) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const handleViewDetails = () => {
    router.push(`/orders/${order.id}`);
  };

  const handleTrackOrder = () => {
    router.push(`/orders/${order.id}/tracking`);
  };

  const handleCancelOrder = async () => {
    if (!confirm('Are you sure you want to cancel this order?')) return;
    
    setLoading(true);
    try {
      // TODO: Replace with actual API call
      // await fetch(`/api/orders/${order.id}/cancel`, { method: 'POST' });
    } catch (error) {
      console.error('Error cancelling order:', error);
    } finally {
      setLoading(false);
    }
  };

  const canCancel = ['PENDING', 'CONFIRMED'].includes(order.status);

  return (
    <div className={cn('bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden', className)}>
      {/* Header */}
      <div className="p-4 border-b border-gray-200 flex items-center justify-between">
        <div>
          <p className="text-sm text-gray-500">Order #{order.orderNumber}</p>
          <p className="text-xs text-gray-400">{new Date(order.createdAt).toLocaleDateString()}</p>
        </div>
        <span className={cn('px-3 py-1 rounded-full text-xs font-medium', statusColors[order.status])}>
          {order.status}
        </span>
      </div>

      {/* Items */}
      <div className="p-4 space-y-3">
        {order.items.slice(0, 3).map(item => (
          <div key={item.id} className="flex items-center gap-3">
            <div className="w-16 h-16 bg-gray-100 rounded flex-shrink-0">
              <img
                src={item.image}
                alt={item.name}
                className="w-full h-full object-cover rounded"
              />
            </div>
            <div className="flex-1">
              <p className="font-medium text-sm">{item.name}</p>
              <p className="text-xs text-gray-500">Qty: {item.quantity}</p>
            </div>
            <p className="font-semibold">${(item.price * item.quantity).toFixed(2)}</p>
          </div>
        ))}
        {order.items.length > 3 && (
          <p className="text-sm text-gray-500">+{order.items.length - 3} more items</p>
        )}
      </div>

      {/* Footer */}
      <div className="p-4 border-t border-gray-200 flex items-center justify-between">
        <div>
          <p className="text-sm text-gray-500">Total</p>
          <p className="text-lg font-bold">${order.total.toFixed(2)}</p>
        </div>
        <div className="flex gap-2">
          <button
            onClick={handleViewDetails}
            className="px-4 py-2 text-sm font-medium text-indigo-600 hover:text-indigo-700"
          >
            View Details
          </button>
          {['SHIPPED', 'DELIVERED'].includes(order.status) && (
            <button
              onClick={handleTrackOrder}
              className="px-4 py-2 text-sm font-medium bg-indigo-600 text-white rounded hover:bg-indigo-700"
            >
              Track Order
            </button>
          )}
          {canCancel && (
            <button
              onClick={handleCancelOrder}
              disabled={loading}
              className="px-4 py-2 text-sm font-medium text-red-600 hover:text-red-700 disabled:opacity-50"
            >
              Cancel
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
