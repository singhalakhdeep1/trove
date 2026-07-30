'use client';

import { useState, useEffect } from 'react';
import { cn } from '@/lib/utils';

interface Testimonial {
  id: string;
  name: string;
  role: string;
  avatar: string;
  content: string;
  rating: number;
}

interface TestimonialsProps {
  className?: string;
  data?: any;
}

export default function Testimonials({ className, data }: TestimonialsProps) {
  const [testimonials, setTestimonials] = useState<Testimonial[]>(data?.testimonials || []);
  const [loading, setLoading] = useState(!data);

  useEffect(() => {
    if (!data) {
      // Mock data
      setTestimonials([
        {
          id: '1',
          name: 'Sarah Johnson',
          role: 'Verified Buyer',
          avatar: '/images/avatar1.jpg',
          content: 'Amazing products and fast delivery! I\'ve been shopping here for months and never been disappointed.',
          rating: 5,
        },
        {
          id: '2',
          name: 'Michael Chen',
          role: 'Verified Buyer',
          avatar: '/images/avatar2.jpg',
          content: 'Great selection and competitive prices. The customer service is also excellent.',
          rating: 5,
        },
        {
          id: '3',
          name: 'Emily Davis',
          role: 'Verified Buyer',
          avatar: '/images/avatar3.jpg',
          content: 'Love the variety of products available. Always find what I\'m looking for!',
          rating: 4,
        },
      ]);
      setLoading(false);
    }
  }, [data]);

  if (loading) {
    return (
      <div className={cn('py-8', className)}>
        <h2 className="text-2xl font-bold text-gray-900 mb-6">What Our Customers Say</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="bg-gray-200 rounded-lg h-48 animate-pulse" />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className={cn('py-8 bg-gray-50', className)}>
      <h2 className="text-2xl font-bold text-gray-900 mb-6 text-center">What Our Customers Say</h2>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {testimonials.map((testimonial) => (
          <div key={testimonial.id} className="bg-white rounded-lg shadow-md p-6">
            <div className="flex items-center gap-4 mb-4">
              <img
                src={testimonial.avatar}
                alt={testimonial.name}
                className="w-12 h-12 rounded-full object-cover"
              />
              <div>
                <h3 className="font-semibold text-gray-900">{testimonial.name}</h3>
                <p className="text-sm text-gray-500">{testimonial.role}</p>
              </div>
            </div>
            <div className="flex gap-1 mb-3">
              {[...Array(testimonial.rating)].map((_, i) => (
                <svg key={i} className="w-5 h-5 text-yellow-400 fill-current" viewBox="0 0 20 20">
                  <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                </svg>
              ))}
            </div>
            <p className="text-gray-600">{testimonial.content}</p>
          </div>
        ))}
      </div>
    </div>
  );
}