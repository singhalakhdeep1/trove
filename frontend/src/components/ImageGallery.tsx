'use client';

import { useState } from 'react';
import { cn } from '@/lib/utils';

interface ImageGalleryProps {
  className?: string;
  data?: any;
}

export default function ImageGallery({ className, data }: ImageGalleryProps) {
  const images = data?.images || ['/placeholder.jpg', '/placeholder2.jpg', '/placeholder3.jpg'];
  const [selectedImage, setSelectedImage] = useState(images[0]);

  return (
    <div className={cn('p-4 bg-white rounded-lg shadow-sm border border-gray-100', className)}>
      <div className="w-full h-80 bg-gray-200 rounded-lg flex items-center justify-center text-gray-500 font-semibold mb-4">
        Product Image Preview
      </div>
      <div className="flex gap-2 overflow-x-auto">
        {images.map((img: string, idx: number) => (
          <button
            key={idx}
            onClick={() => setSelectedImage(img)}
            className="w-16 h-16 bg-gray-100 rounded border border-gray-300 flex-shrink-0"
          />
        ))}
      </div>
    </div>
  );
}
