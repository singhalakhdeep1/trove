'use client';

import { useState, useEffect } from 'react';
import { cn } from '@/lib/utils';

interface HeroProps {
  className?: string;
  data?: any;
  onAction?: (action: string, data: any) => void;
}

export default function Hero({ 
  className, 
  data, 
  onAction 
}: HeroProps) {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [loading, setLoading] = useState(false);

  const slides = data?.slides || [
    {
      title: 'Welcome to Marketplace',
      subtitle: 'Discover amazing products from sellers worldwide',
      image: '/images/hero1.jpg',
      cta: 'Shop Now',
      link: '/products'
    },
    {
      title: 'Fast Delivery',
      subtitle: 'Get your orders delivered to your doorstep',
      image: '/images/hero2.jpg',
      cta: 'Learn More',
      link: '/services'
    },
    {
      title: 'Best Prices',
      subtitle: 'Compare prices and find the best deals',
      image: '/images/hero3.jpg',
      cta: 'Browse Deals',
      link: '/deals'
    }
  ];

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length);
    }, 5000);

    return () => clearInterval(timer);
  }, [slides.length]);

  const handleAction = async (action: string, payload?: any) => {
    try {
      setLoading(true);
      if (onAction) {
        onAction(action, payload);
      }
    } catch (error) {
      console.error('Hero action error:', error);
    } finally {
      setLoading(false);
    }
  };

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % slides.length);
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + slides.length) % slides.length);
  };

  const currentSlideData = slides[currentSlide];

  return (
    <div className={cn(
      'relative overflow-hidden bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg shadow-lg',
      className
    )}>
      <div className="absolute inset-0 bg-black/20" />
      
      <div className="relative z-10 px-8 py-16 md:py-24">
        <div className="max-w-3xl">
          <h1 className="text-4xl md:text-6xl font-bold text-white mb-4">
            {currentSlideData.title}
          </h1>
          <p className="text-xl md:text-2xl text-white/90 mb-8">
            {currentSlideData.subtitle}
          </p>
          <button
            onClick={() => handleAction('navigate', currentSlideData.link)}
            className="px-8 py-3 bg-white text-blue-600 rounded-lg font-semibold hover:bg-gray-100 transition-colors"
            disabled={loading}
          >
            {currentSlideData.cta}
          </button>
        </div>
      </div>

      {/* Slide indicators */}
      <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex gap-2">
        {slides.map((_, index) => (
          <button
            key={index}
            onClick={() => setCurrentSlide(index)}
            className={cn(
              'w-3 h-3 rounded-full transition-colors',
              index === currentSlide ? 'bg-white' : 'bg-white/50'
            )}
          />
        ))}
      </div>

      {/* Navigation arrows */}
      <button
        onClick={prevSlide}
        className="absolute left-4 top-1/2 transform -translate-y-1/2 p-2 bg-white/20 hover:bg-white/30 rounded-full text-white"
      >
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
        </svg>
      </button>
      <button
        onClick={nextSlide}
        className="absolute right-4 top-1/2 transform -translate-y-1/2 p-2 bg-white/20 hover:bg-white/30 rounded-full text-white"
      >
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
        </svg>
      </button>
    </div>
  );
}
