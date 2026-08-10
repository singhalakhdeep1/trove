'use client';

import { useState } from 'react';
import { cn } from '@/lib/utils';

interface UsersProps {
  className?: string;
  data?: any;
  onAction?: (action: string, data?: any) => void;
}

export default function Users({ className, data, onAction }: UsersProps) {
  const users = data?.users || [
    { id: '1', name: 'Alice Smith', email: 'alice@example.com', role: 'Customer', status: 'Active' },
    { id: '2', name: 'Bob Jones', email: 'bob@example.com', role: 'Seller', status: 'Active' },
    { id: '3', name: 'Carol White', email: 'carol@example.com', role: 'Admin', status: 'Active' },
  ];

  return (
    <div className={cn('p-6 bg-white rounded-lg shadow-sm border border-gray-100 mt-6', className)}>
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-bold text-gray-900">User Management</h2>
        <button className="px-4 py-2 bg-blue-600 text-white rounded-md text-sm hover:bg-blue-700">
          Add User
        </button>
      </div>
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead>
            <tr>
              <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase">Name</th>
              <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase">Email</th>
              <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase">Role</th>
              <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase">Status</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {users.map((user: any) => (
              <tr key={user.id}>
                <td className="px-4 py-3 text-sm font-medium text-gray-900">{user.name}</td>
                <td className="px-4 py-3 text-sm text-gray-600">{user.email}</td>
                <td className="px-4 py-3 text-sm text-gray-600">{user.role}</td>
                <td className="px-4 py-3 text-sm text-green-600 font-medium">{user.status}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
