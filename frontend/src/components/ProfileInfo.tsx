'use client';

import { useState } from 'react';
import { cn } from '@/lib/utils';

interface ProfileInfoProps {
  className?: string;
  data?: any;
}

export default function ProfileInfo({ className, data }: ProfileInfoProps) {
  const profile = data?.profile || {
    name: 'Alex Johnson',
    email: 'alex.johnson@example.com',
    phone: '+1 (555) 234-5678',
    joinDate: 'January 2025',
  };

  return (
    <div className={cn('p-6 bg-white rounded-lg shadow-sm border border-gray-100', className)}>
      <h2 className="text-xl font-bold text-gray-900 mb-4">Profile Information</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
        <div>
          <p className="text-gray-500 font-medium">Full Name</p>
          <p className="text-gray-900 font-semibold mt-1">{profile.name}</p>
        </div>
        <div>
          <p className="text-gray-500 font-medium">Email Address</p>
          <p className="text-gray-900 font-semibold mt-1">{profile.email}</p>
        </div>
        <div>
          <p className="text-gray-500 font-medium">Phone Number</p>
          <p className="text-gray-900 font-semibold mt-1">{profile.phone}</p>
        </div>
        <div>
          <p className="text-gray-500 font-medium">Member Since</p>
          <p className="text-gray-900 font-semibold mt-1">{profile.joinDate}</p>
        </div>
      </div>
    </div>
  );
}
