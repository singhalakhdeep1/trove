'use client';

import { useState, useEffect } from 'react';
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

interface OrdersProps {
  className?: string;
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

export default function Orders({ className }: OrdersProps) {
  const router = useRouter();
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<string>('all');

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      // TODO: Replace with actual API call
      // const response = await fetch('/api/orders');
      // const data = await response.json();
      // setOrders(data);
      
      // Mock data for now
      setOrders([
        {
          id: '1',
          orderNumber: 'ORD-901',
          status: 'DELIVERED',
          total: 259.97,
          createdAt: '2024-01-15T10:00:00Z',
          items: [
            { id: '1', name: 'Wireless Headphones', image: '/products/headphones.jpg', quantity: 2, price: 99.99 },
            { id: '2', name: 'Smart Watch', image: '/products/watch.jpg', quantity: 1, price: 50.01 },
          ],
        },
        {
          id: '2',
          orderNumber: 'ORD-902',
          status: 'SHIPPED',
          total: 149.99,
          createdAt: '2024-01-20T14:30:00Z',
          items: [
            { id: '3', name: 'Bluetooth Speaker', image: '/products/speaker.jpg', quantity: 1, price: 149.99 },
          ],
        },
        {
          id: '3',
          orderNumber: 'ORD-903',
          status: 'PROCESSING',
          total: 79.99,
          createdAt: '2024-01-25T09:15:00Z',
          items: [
            { id: '4', name: 'Phone Case', image: '/products/case.jpg', quantity: 2, price: 39.99 },
          ],
        },
      ]);
    } catch (error) {
      console.error('Error fetching orders:', error);
    } finally {
      setLoading(false);
    }
  };

  const filteredOrders = filter === 'all' 
    ? orders 
    : orders.filter(order => order.status === filter);

  if (loading) {
    return (
      <div className={cn('p-6 bg-white rounded-lg shadow-sm border border-gray-100', className)}>
        <div className="animate-pulse space-y-4">
          <div className="h-6 bg-gray-200 rounded w-1/3"></div>
          <div className="space-y-3">
            {[1, 2, 3].map(i => (
              <div key={i} className="h-24 bg-gray-200 rounded"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={cn('p-6 bg-white rounded-lg shadow-sm border border-gray-100', className)}>
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-bold text-gray-900">My Orders ({orders.length})</h2>
        <select
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
          className="px-3 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-indigo-500"
        >
          <option value="all">All Orders</option>
          <option value="PENDING">Pending</option>
          <option value="PROCESSING">Processing</option>
          <option value="SHIPPED">Shipped</option>
          <option value="DELIVERED">Delivered</option>
        </select>
      </div>

      {filteredOrders.length === 0 ? (
        <div className="text-center py-12">
          <svg className="w-16 h-16 mx-auto text-gray-300 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
          </svg>
          <p className="text-gray-500 mb-4">No orders found</p>
          <button
            onClick={() => router.push('/products')}
            className="px-6 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700"
          >
            Start Shopping
          </button>
        </div>
      ) : (
        <div className="space-y-4">
          {filteredOrders.map(order => (
            <div
              key={order.id}
              className="border rounded-lg p-4 hover:shadow-md transition-shadow cursor-pointer"
              onClick={() => router.push(`/orders/${order.id}`)}
            >
              <div className="flex items-center justify-between mb-3">
                <div>
                  <p className="font-medium text-gray-900">Order #{order.orderNumber}</p>
                  <p className="text-sm text-gray-500">{new Date(order.createdAt).toLocaleDateString()}</p>
                </div>
                <span className={cn('px-3 py-1 rounded-full text-xs font-medium', statusColors[order.status])}>
                  {order.status}
                </span>
              </div>

              <div className="flex items-center gap-3 mb-3">
                {order.items.slice(0, 3).map(item => (
                  <div key={item.id} className="w-12 h-12 bg-gray-100 rounded">
                    <img
                      src={item.image}
                      alt={item.name}
                      className="w-full h-full object-cover rounded"
                    />
                  </div>
                ))}
                {order.items.length > 3 && (
                  <p className="text-sm text-gray-500">+{order.items.length - 3} more</p>
                )}
              </div>

              <div className="flex items-center justify-between">
                <p className="text-sm text-gray-500">{order.items.length} item{order.items.length > 1 ? 's' : ''}</p>
                <p className="font-semibold text-gray-900">${order.total.toFixed(2)}</p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
