'use client';

import { useState } from 'react';
import { cn } from '@/lib/utils';
import HotelCard from './HotelCard';

interface HotelGridProps {
  className?: string;
  data?: any;
}

export default function HotelGrid({ className, data }: HotelGridProps) {
  const hotels = data?.hotels || [
    { id: '1', name: 'Grand Luxury Resort & Spa', location: 'San Francisco, CA', pricePerNight: '$280', rating: 4.9 },
    { id: '2', name: 'Boutique City Center Hotel', location: 'Palo Alto, CA', pricePerNight: '$195', rating: 4.7 },
    { id: '3', name: 'Coastal Breeze Inn', location: 'Monterey, CA', pricePerNight: '$150', rating: 4.6 },
  ];

  return (
    <div className={cn('py-6', className)}>
      <h2 className="text-2xl font-bold text-gray-900 mb-6">Top Rated Hotels & Stays</h2>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {hotels.map((hotel: any) => (
          <HotelCard key={hotel.id} data={hotel} />
        ))}
      </div>
    </div>
  );
}
