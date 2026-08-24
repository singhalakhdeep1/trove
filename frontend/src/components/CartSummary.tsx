'use client';

import { useState } from 'react';
import { cn } from '@/lib/utils';

interface CartSummaryProps {
  className?: string;
  subtotal?: number;
  shipping?: number;
  tax?: number;
  discount?: number;
  onCheckout?: () => void;
}

export default function CartSummary({ 
  className, 
  subtotal = 0,
  shipping = 0,
  tax = 0,
  discount = 0,
  onCheckout 
}: CartSummaryProps) {
  const [promoCode, setPromoCode] = useState('');
  const [applyingPromo, setApplyingPromo] = useState(false);

  const total = subtotal + shipping + tax - discount;

  const handleApplyPromo = async () => {
    if (!promoCode.trim()) return;
    
    setApplyingPromo(true);
    try {
      // TODO: Replace with actual API call
      // const response = await fetch('/api/cart/promo', {
      //   method: 'POST',
      //   body: JSON.stringify({ code: promoCode }),
      // });
      // const data = await response.json();
      // Update discount from response
    } catch (error) {
      console.error('Error applying promo code:', error);
    } finally {
      setApplyingPromo(false);
    }
  };

  return (
    <div className={cn('p-6 bg-white rounded-lg shadow-sm border border-gray-100', className)}>
      <h2 className="text-xl font-bold text-gray-900 mb-4">Order Summary</h2>
      
      <div className="space-y-3 text-sm">
        <div className="flex justify-between text-gray-600">
          <span>Subtotal</span>
          <span className="font-semibold text-gray-900">${subtotal.toFixed(2)}</span>
        </div>
        
        <div className="flex justify-between text-gray-600">
          <span>Estimated Shipping</span>
          <span className="font-semibold text-gray-900">
            {shipping === 0 ? 'FREE' : `$${shipping.toFixed(2)}`}
          </span>
        </div>
        
        <div className="flex justify-between text-gray-600">
          <span>Tax</span>
          <span className="font-semibold text-gray-900">${tax.toFixed(2)}</span>
        </div>
        
        {discount > 0 && (
          <div className="flex justify-between text-green-600">
            <span>Discount</span>
            <span className="font-semibold">-${discount.toFixed(2)}</span>
          </div>
        )}
        
        <div className="border-t border-gray-200 pt-3 flex justify-between text-lg font-bold text-gray-900">
          <span>Total</span>
          <span>${total.toFixed(2)}</span>
        </div>
      </div>

      {/* Promo Code */}
      <div className="mt-4">
        <div className="flex gap-2">
          <input
            type="text"
            placeholder="Promo code"
            value={promoCode}
            onChange={(e) => setPromoCode(e.target.value)}
            className="flex-1 px-3 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />
          <button
            onClick={handleApplyPromo}
            disabled={applyingPromo || !promoCode.trim()}
            className="px-4 py-2 bg-gray-200 text-gray-800 rounded hover:bg-gray-300 disabled:opacity-50"
          >
            {applyingPromo ? 'Applying...' : 'Apply'}
          </button>
        </div>
      </div>

      <button
        onClick={onCheckout}
        className="w-full mt-6 py-3 bg-indigo-600 text-white font-bold rounded-lg hover:bg-indigo-700 transition-colors"
      >
        Proceed to Checkout
      </button>

      <div className="mt-4 text-xs text-gray-500 text-center">
        <p>Secure checkout powered by Stripe</p>
        <p className="mt-1">Free returns within 30 days</p>
      </div>
    </div>
  );
}
