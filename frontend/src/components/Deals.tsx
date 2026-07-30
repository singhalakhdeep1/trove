'use client';

import { useState, useEffect } from 'react';
import { cn } from '@/lib/utils';
import { formatCurrency } from '@/lib/utils';

interface Deal {
  id: string;
  title: string;
  originalPrice: number;
  discountedPrice: number;
  discount: number;
  image: string;
  endTime: Date;
}

interface DealsProps {
  className?: string;
  data?: any;
}

export default function Deals({ className, data }: DealsProps) {
  const [deals, setDeals] = useState<Deal[]>(data?.deals || []);
  const [loading, setLoading] = useState(!data);
  const [timeLeft, setTimeLeft] = useState({ hours: 0, minutes: 0, seconds: 0 });

  useEffect(() => {
    if (!data) {
      // Mock data
      setDeals([
        {
          id: '1',
          title: 'Summer Sale',
          originalPrice: 99.99,
          discountedPrice: 49.99,
          discount: 50,
          image: '/images/deal1.jpg',
          endTime: new Date(Date.now() + 24 * 60 * 60 * 1000),
        },
        {
          id: '2',
          title: 'Flash Deal',
          originalPrice: 149.99,
          discountedPrice: 79.99,
          discount: 47,
          image: '/images/deal2.jpg',
          endTime: new Date(Date.now() + 12 * 60 * 60 * 1000),
        },
        {
          id: '3',
          title: 'Weekend Special',
          originalPrice: 199.99,
          discountedPrice: 99.99,
          discount: 50,
          image: '/images/deal3.jpg',
          endTime: new Date(Date.now() + 48 * 60 * 60 * 1000),
        },
      ]);
      setLoading(false);
    }
  }, [data]);

  useEffect(() => {
    const timer = setInterval(() => {
      const now = new Date();
      const end = new Date(now.getTime() + 24 * 60 * 60 * 1000);
      const diff = end.getTime() - now.getTime();

      const hours = Math.floor(diff / (1000 * 60 * 60));
      const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
      const seconds = Math.floor((diff % (1000 * 60)) / 1000);

      setTimeLeft({ hours, minutes, seconds });
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  if (loading) {
    return (
      <div className={cn('py-8', className)}>
        <h2 className="text-2xl font-bold text-gray-900 mb-6">Hot Deals</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="bg-gray-200 rounded-lg h-64 animate-pulse" />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className={cn('py-8', className)}>
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold text-gray-900">Hot Deals</h2>
        <div className="flex items-center gap-2 text-red-600">
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <span className="font-mono">
            {String(timeLeft.hours).padStart(2, '0')}:
            {String(timeLeft.minutes).padStart(2, '0')}:
            {String(timeLeft.seconds).padStart(2, '0')}
          </span>
        </div>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {deals.map((deal) => (
          <div key={deal.id} className="bg-white rounded-lg shadow-md overflow-hidden">
            <div className="relative">
              <img src={deal.image} alt={deal.title} className="w-full h-48 object-cover" />
              <div className="absolute top-2 right-2 bg-red-600 text-white px-3 py-1 rounded-full font-bold">
                -{deal.discount}%
              </div>
            </div>
            <div className="p-4">
              <h3 className="font-semibold text-gray-900 mb-2">{deal.title}</h3>
              <div className="flex items-center gap-2">
                <span className="text-xl font-bold text-red-600">
                  {formatCurrency(deal.discountedPrice)}
                </span>
                <span className="text-sm text-gray-400 line-through">
                  {formatCurrency(deal.originalPrice)}
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}