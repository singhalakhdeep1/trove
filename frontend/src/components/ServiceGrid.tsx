'use client';

import { useState } from 'react';
import { cn } from '@/lib/utils';
import ServiceCard from './ServiceCard';

interface ServiceGridProps {
  className?: string;
  data?: any;
}

export default function ServiceGrid({ className, data }: ServiceGridProps) {
  const services = data?.services || [
    { id: '1', name: 'Home Deep Cleaning', category: 'Cleaning', rating: 4.9, hourlyRate: '$45/hr' },
    { id: '2', name: 'Certified Electrician Services', category: 'Maintenance', rating: 4.8, hourlyRate: '$65/hr' },
    { id: '3', name: 'Personal Fitness Coaching', category: 'Health', rating: 5.0, hourlyRate: '$50/hr' },
  ];

  return (
    <div className={cn('py-6', className)}>
      <h2 className="text-2xl font-bold text-gray-900 mb-6">Popular Professional Services</h2>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {services.map((svc: any) => (
          <ServiceCard key={svc.id} data={svc} />
        ))}
      </div>
    </div>
  );
}
