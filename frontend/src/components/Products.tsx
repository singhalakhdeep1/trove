'use client';

import { useState } from 'react';
import { cn } from '@/lib/utils';

interface ProductsProps {
  className?: string;
  data?: any;
  onAction?: (action: string, data?: any) => void;
}

export default function Products({ className, data, onAction }: ProductsProps) {
  const products = data?.products || [
    { id: 'P-1', name: 'Wireless Headphones', category: 'Electronics', price: '$199.99', stock: 45 },
    { id: 'P-2', name: 'Ergonomic Chair', category: 'Furniture', price: '$299.00', stock: 12 },
    { id: 'P-3', name: 'Smart Watch', category: 'Wearables', price: '$149.50', stock: 88 },
  ];

  return (
    <div className={cn('p-6 bg-white rounded-lg shadow-sm border border-gray-100 mt-6', className)}>
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-bold text-gray-900">Products Catalog</h2>
        <button className="px-4 py-2 bg-blue-600 text-white rounded-md text-sm hover:bg-blue-700">
          Add Product
        </button>
      </div>
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead>
            <tr>
              <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase">ID</th>
              <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase">Product Name</th>
              <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase">Category</th>
              <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase">Price</th>
              <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase">Stock</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {products.map((item: any) => (
              <tr key={item.id}>
                <td className="px-4 py-3 text-sm text-gray-500">{item.id}</td>
                <td className="px-4 py-3 text-sm font-medium text-gray-900">{item.name}</td>
                <td className="px-4 py-3 text-sm text-gray-600">{item.category}</td>
                <td className="px-4 py-3 text-sm font-semibold text-gray-900">{item.price}</td>
                <td className="px-4 py-3 text-sm text-gray-600">{item.stock} units</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
