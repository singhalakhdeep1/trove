'use client';

import { useState, useEffect } from 'react';
import { cn } from '@/lib/utils';

interface OverviewProps {
  className?: string;
  data?: any;
  onAction?: (action: string, data?: any) => void;
}

export default function Overview({ className, data, onAction }: OverviewProps) {
  const [loading, setLoading] = useState(false);

  return (
    <div className={cn('p-6 bg-white rounded-lg shadow-sm border border-gray-100', className)}>
      <h2 className="text-xl font-bold text-gray-900 mb-4">Overview & Key Metrics</h2>
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="p-4 bg-blue-50 rounded-lg">
          <p className="text-sm font-medium text-blue-600">Total Sales</p>
          <p className="text-2xl font-bold text-gray-900 mt-1">{data?.totalSales || '$24,500'}</p>
        </div>
        <div className="p-4 bg-green-50 rounded-lg">
          <p className="text-sm font-medium text-green-600">Total Orders</p>
          <p className="text-2xl font-bold text-gray-900 mt-1">{data?.totalOrders || '1,240'}</p>
        </div>
        <div className="p-4 bg-purple-50 rounded-lg">
          <p className="text-sm font-medium text-purple-600">Active Users</p>
          <p className="text-2xl font-bold text-gray-900 mt-1">{data?.activeUsers || '8,420'}</p>
        </div>
        <div className="p-4 bg-amber-50 rounded-lg">
          <p className="text-sm font-medium text-amber-600">Pending Reviews</p>
          <p className="text-2xl font-bold text-gray-900 mt-1">{data?.pendingReviews || '18'}</p>
        </div>
      </div>
    </div>
  );
}
