'use client';

import { useState } from 'react';
import { cn } from '@/lib/utils';

interface AnalyticsProps {
  className?: string;
  data?: any;
}

export default function Analytics({ className, data }: AnalyticsProps) {
  return (
    <div className={cn('p-6 bg-white rounded-lg shadow-sm border border-gray-100 mt-6', className)}>
      <h2 className="text-xl font-bold text-gray-900 mb-4">Seller Analytics & Growth</h2>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="p-4 bg-gray-50 rounded-lg">
          <p className="text-sm font-medium text-gray-500">Conversion Rate</p>
          <p className="text-2xl font-bold text-gray-900 mt-1">3.4%</p>
          <p className="text-xs text-green-600 font-medium mt-1">↑ +0.8% vs last month</p>
        </div>
        <div className="p-4 bg-gray-50 rounded-lg">
          <p className="text-sm font-medium text-gray-500">Average Order Value</p>
          <p className="text-2xl font-bold text-gray-900 mt-1">$76.20</p>
          <p className="text-xs text-green-600 font-medium mt-1">↑ +$4.50 vs last month</p>
        </div>
        <div className="p-4 bg-gray-50 rounded-lg">
          <p className="text-sm font-medium text-gray-500">Store Views</p>
          <p className="text-2xl font-bold text-gray-900 mt-1">14,280</p>
          <p className="text-xs text-green-600 font-medium mt-1">↑ +12% growth</p>
        </div>
      </div>
    </div>
  );
}
