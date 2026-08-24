'use client';

import { useState, useEffect } from 'react';
import { cn } from '@/lib/utils';

interface OrderItem {
  id: string;
  name: string;
  image: string;
  quantity: number;
  price: number;
  variant?: string;
}

interface Order {
  id: string;
  orderNumber: string;
  status: 'PENDING' | 'CONFIRMED' | 'PROCESSING' | 'SHIPPED' | 'DELIVERED' | 'CANCELLED' | 'REFUNDED';
  total: number;
  subtotal: number;
  shipping: number;
  tax: number;
  createdAt: string;
  items: OrderItem[];
  shippingAddress: {
    street: string;
    apartment?: string;
    city: string;
    state: string;
    zipCode: string;
    country: string;
  };
  paymentMethod: string;
  trackingNumber?: string;
  carrier?: string;
}

interface OrderDetailsProps {
  className?: string;
  orderId: string;
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

export default function OrderDetails({ className, orderId }: OrderDetailsProps) {
  const [order, setOrder] = useState<Order | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchOrder();
  }, [orderId]);

  const fetchOrder = async () => {
    try {
      // TODO: Replace with actual API call
      // const response = await fetch(`/api/orders/${orderId}`);
      // const data = await response.json();
      // setOrder(data);
      
      // Mock data for now
      setOrder({
        id: orderId,
        orderNumber: 'ORD-901',
        status: 'DELIVERED',
        total: 259.97,
        subtotal: 249.99,
        shipping: 0,
        tax: 9.98,
        createdAt: '2024-01-15T10:00:00Z',
        items: [
          {
            id: '1',
            name: 'Wireless Headphones',
            image: '/products/headphones.jpg',
            quantity: 2,
            price: 99.99,
          },
          {
            id: '2',
            name: 'Smart Watch',
            image: '/products/watch.jpg',
            price: 50.01,
            quantity: 1,
          },
        ],
        shippingAddress: {
          street: '123 Market Street',
          apartment: 'Apt 4B',
          city: 'San Francisco',
          state: 'CA',
          zipCode: '94105',
          country: 'USA',
        },
        paymentMethod: 'Visa ending in 4242',
        trackingNumber: 'TRK-984019284',
        carrier: 'FedEx Express',
      });
    } catch (error) {
      console.error('Error fetching order:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className={cn('p-6 bg-white rounded-lg shadow-sm border border-gray-100', className)}>
        <div className="animate-pulse space-y-4">
          <div className="h-6 bg-gray-200 rounded w-1/3"></div>
          <div className="h-4 bg-gray-200 rounded w-full"></div>
          <div className="h-4 bg-gray-200 rounded w-2/3"></div>
        </div>
      </div>
    );
  }

  if (!order) {
    return (
      <div className={cn('p-6 bg-white rounded-lg shadow-sm border border-gray-100', className)}>
        <p className="text-gray-500">Order not found</p>
      </div>
    );
  }

  return (
    <div className={cn('p-6 bg-white rounded-lg shadow-sm border border-gray-100', className)}>
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-xl font-bold text-gray-900">Order #{order.orderNumber}</h2>
          <p className="text-sm text-gray-500">Placed on {new Date(order.createdAt).toLocaleDateString()}</p>
        </div>
        <span className={cn('px-3 py-1 rounded-full text-sm font-medium', statusColors[order.status])}>
          {order.status}
        </span>
      </div>

      {/* Tracking Info */}
      {order.trackingNumber && (
        <div className="mb-6 p-4 bg-indigo-50 rounded-lg">
          <p className="text-sm text-gray-600 font-medium">Tracking Information</p>
          <p className="text-indigo-900 font-semibold mt-1">{order.trackingNumber}</p>
          <p className="text-sm text-indigo-700">{order.carrier}</p>
        </div>
      )}

      {/* Items */}
      <div className="mb-6">
        <h3 className="font-semibold text-gray-900 mb-3">Items</h3>
        <div className="space-y-3">
          {order.items.map(item => (
            <div key={item.id} className="flex items-center gap-4 p-3 border rounded-lg">
              <img
                src={item.image}
                alt={item.name}
                className="w-16 h-16 object-cover rounded"
              />
              <div className="flex-1">
                <p className="font-medium">{item.name}</p>
                {item.variant && <p className="text-sm text-gray-500">{item.variant}</p>}
                <p className="text-sm text-gray-500">Qty: {item.quantity}</p>
              </div>
              <p className="font-semibold">${(item.price * item.quantity).toFixed(2)}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Shipping Address */}
      <div className="mb-6">
        <h3 className="font-semibold text-gray-900 mb-3">Shipping Address</h3>
        <div className="text-sm text-gray-700">
          <p>{order.shippingAddress.street}</p>
          {order.shippingAddress.apartment && <p>{order.shippingAddress.apartment}</p>}
          <p>{order.shippingAddress.city}, {order.shippingAddress.state} {order.shippingAddress.zipCode}</p>
          <p>{order.shippingAddress.country}</p>
        </div>
      </div>

      {/* Payment Method */}
      <div className="mb-6">
        <h3 className="font-semibold text-gray-900 mb-3">Payment Method</h3>
        <p className="text-sm text-gray-700">{order.paymentMethod}</p>
      </div>

      {/* Order Summary */}
      <div className="border-t pt-4">
        <div className="space-y-2 text-sm">
          <div className="flex justify-between text-gray-600">
            <span>Subtotal</span>
            <span>${order.subtotal.toFixed(2)}</span>
          </div>
          <div className="flex justify-between text-gray-600">
            <span>Shipping</span>
            <span>{order.shipping === 0 ? 'FREE' : `$${order.shipping.toFixed(2)}`}</span>
          </div>
          <div className="flex justify-between text-gray-600">
            <span>Tax</span>
            <span>${order.tax.toFixed(2)}</span>
          </div>
          <div className="flex justify-between text-lg font-bold text-gray-900 pt-2 border-t">
            <span>Total</span>
            <span>${order.total.toFixed(2)}</span>
          </div>
        </div>
      </div>
    </div>
  );
}
