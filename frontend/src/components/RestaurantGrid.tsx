'use client';

import { useState } from 'react';
import { cn } from '@/lib/utils';
import RestaurantCard from './RestaurantCard';

interface RestaurantGridProps {
  className?: string;
  data?: any;
}

export default function RestaurantGrid({ className, data }: RestaurantGridProps) {
  const restaurants = data?.restaurants || [
    { id: '1', name: 'La Trattoria Italian', cuisine: 'Italian', rating: 4.8, deliveryTime: '25-35 min', priceRange: '$$' },
    { id: '2', name: 'Sakura Sushi & Ramen', cuisine: 'Japanese', rating: 4.9, deliveryTime: '30-40 min', priceRange: '$$$' },
    { id: '3', name: 'Taco Barrio', cuisine: 'Mexican', rating: 4.6, deliveryTime: '15-25 min', priceRange: '$' },
  ];

  return (
    <div className={cn('py-6', className)}>
      <h2 className="text-2xl font-bold text-gray-900 mb-6">Nearby Restaurants</h2>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {restaurants.map((item: any) => (
          <RestaurantCard key={item.id} data={item} />
        ))}
      </div>
    </div>
  );
}
