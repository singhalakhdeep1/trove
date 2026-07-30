'use client';

import { useState } from 'react';
import { cn } from '@/lib/utils';
import { useRouter } from 'next/navigation';
import { useCartStore } from '@/store/cart.store';
import { useWishlistStore } from '@/store/wishlist.store';
import { formatCurrency } from '@/lib/utils';

interface ProductCardProps {
  product: {
    id: string;
    name: string;
    description: string;
    price: number;
    images: string[];
    rating?: number;
    seller?: {
      user: {
        firstName: string;
        lastName: string;
      };
    };
    category?: {
      name: string;
    };
  };
  className?: string;
}

export default function ProductCard({ product, className }: ProductCardProps) {
  const router = useRouter();
  const { addItem: addToCart } = useCartStore();
  const { addItem: addToWishlist, isInWishlist, removeItem } = useWishlistStore();
  const [loading, setLoading] = useState(false);
  const [isWishlisted, setIsWishlisted] = useState(false);

  const handleAddToCart = async () => {
    try {
      setLoading(true);
      await addToCart(product.id, 1);
    } catch (error) {
      console.error('Failed to add to cart:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleWishlist = async () => {
    try {
      if (isWishlisted) {
        await removeItem(product.id);
        setIsWishlisted(false);
      } else {
        await addToWishlist(product.id);
        setIsWishlisted(true);
      }
    } catch (error) {
      console.error('Failed to update wishlist:', error);
    }
  };

  const handleViewDetails = () => {
    router.push(`/products/${product.id}`);
  };

  const mainImage = product.images?.[0] || '/images/placeholder.jpg';

  return (
    <div className={cn('bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow', className)}>
      {/* Image */}
      <div className="relative aspect-square cursor-pointer" onClick={handleViewDetails}>
        <img
          src={mainImage}
          alt={product.name}
          className="w-full h-full object-cover"
        />
        <button
          onClick={handleWishlist}
          className="absolute top-2 right-2 p-2 bg-white rounded-full shadow hover:bg-gray-100"
        >
          <svg
            className={cn('w-5 h-5', isWishlisted ? 'text-red-500 fill-current' : 'text-gray-400')}
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
            />
          </svg>
        </button>
        {product.rating && (
          <div className="absolute bottom-2 left-2 px-2 py-1 bg-black/50 text-white text-sm rounded flex items-center">
            <svg className="w-4 h-4 text-yellow-400 fill-current" viewBox="0 0 20 20">
              <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
            </svg>
            <span className="ml-1">{product.rating.toFixed(1)}</span>
          </div>
        )}
      </div>

      {/* Content */}
      <div className="p-4">
        <h3
          className="font-semibold text-gray-900 mb-1 cursor-pointer hover:text-blue-600"
          onClick={handleViewDetails}
        >
          {product.name}
        </h3>
        <p className="text-sm text-gray-500 mb-2 line-clamp-2">
          {product.description}
        </p>
        {product.category && (
          <p className="text-xs text-blue-600 mb-2">{product.category.name}</p>
        )}
        {product.seller && (
          <p className="text-xs text-gray-400 mb-2">
            by {product.seller.user.firstName} {product.seller.user.lastName}
          </p>
        )}
        <div className="flex items-center justify-between mt-4">
          <span className="text-lg font-bold text-gray-900">
            {formatCurrency(product.price)}
          </span>
          <button
            onClick={handleAddToCart}
            disabled={loading}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 text-sm font-medium"
          >
            {loading ? 'Adding...' : 'Add to Cart'}
          </button>
        </div>
      </div>
    </div>
  );
}
