'use client';

import { useState } from 'react';
import { cn } from '@/lib/utils';

interface PaymentFormProps {
  className?: string;
  amount: number;
  onSubmit: (paymentData: any) => void;
  loading?: boolean;
}

export default function PaymentForm({ className, amount, onSubmit, loading = false }: PaymentFormProps) {
  const [cardNumber, setCardNumber] = useState('');
  const [expiry, setExpiry] = useState('');
  const [cvc, setCvc] = useState('');
  const [name, setName] = useState('');
  const [saveCard, setSaveCard] = useState(false);
  const [errors, setErrors] = useState<{ [key: string]: string }>({});

  const formatCardNumber = (value: string) => {
    const v = value.replace(/\s+/g, '').replace(/[^0-9]/gi, '');
    const matches = v.match(/\d{4,16}/g);
    const match = (matches && matches[0]) || '';
    const parts = [];
    for (let i = 0, len = match.length; i < len; i += 4) {
      parts.push(match.substring(i, i + 4));
    }
    return parts.length ? parts.join(' ') : v;
  };

  const formatExpiry = (value: string) => {
    const v = value.replace(/\s+/g, '').replace(/[^0-9]/gi, '');
    if (v.length >= 2) {
      return v.substring(0, 2) + '/' + v.substring(2, 4);
    }
    return v;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const newErrors: { [key: string]: string } = {};

    if (!cardNumber || cardNumber.length < 19) {
      newErrors.cardNumber = 'Please enter a valid card number';
    }
    if (!expiry || expiry.length < 5) {
      newErrors.expiry = 'Please enter a valid expiry date';
    }
    if (!cvc || cvc.length < 3) {
      newErrors.cvc = 'Please enter a valid CVC';
    }
    if (!name.trim()) {
      newErrors.name = 'Please enter the cardholder name';
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    onSubmit({
      cardNumber: cardNumber.replace(/\s/g, ''),
      expiry,
      cvc,
      name,
      saveCard,
    });
  };

  return (
    <div className={cn('p-6 bg-white rounded-lg shadow-sm border border-gray-100', className)}>
      <h2 className="text-xl font-bold text-gray-900 mb-4">Payment Information</h2>
      
      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Card Number */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Card Number
          </label>
          <input
            type="text"
            value={cardNumber}
            onChange={(e) => setCardNumber(formatCardNumber(e.target.value))}
            placeholder="1234 5678 9012 3456"
            maxLength={19}
            className={cn(
              'w-full px-3 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-indigo-500',
              errors.cardNumber && 'border-red-500'
            )}
          />
          {errors.cardNumber && (
            <p className="text-red-500 text-sm mt-1">{errors.cardNumber}</p>
          )}
        </div>

        {/* Expiry and CVC */}
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Expiry Date
            </label>
            <input
              type="text"
              value={expiry}
              onChange={(e) => setExpiry(formatExpiry(e.target.value))}
              placeholder="MM/YY"
              maxLength={5}
              className={cn(
                'w-full px-3 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-indigo-500',
                errors.expiry && 'border-red-500'
              )}
            />
            {errors.expiry && (
              <p className="text-red-500 text-sm mt-1">{errors.expiry}</p>
            )}
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              CVC
            </label>
            <input
              type="text"
              value={cvc}
              onChange={(e) => setCvc(e.target.value.replace(/\D/g, ''))}
              placeholder="123"
              maxLength={4}
              className={cn(
                'w-full px-3 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-indigo-500',
                errors.cvc && 'border-red-500'
              )}
            />
            {errors.cvc && (
              <p className="text-red-500 text-sm mt-1">{errors.cvc}</p>
            )}
          </div>
        </div>

        {/* Cardholder Name */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Cardholder Name
          </label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="John Doe"
            className={cn(
              'w-full px-3 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-indigo-500',
              errors.name && 'border-red-500'
            )}
          />
          {errors.name && (
            <p className="text-red-500 text-sm mt-1">{errors.name}</p>
          )}
        </div>

        {/* Save Card */}
        <div className="flex items-center">
          <input
            type="checkbox"
            id="saveCard"
            checked={saveCard}
            onChange={(e) => setSaveCard(e.target.checked)}
            className="w-4 h-4 text-indigo-600 border-gray-300 rounded focus:ring-indigo-500"
          />
          <label htmlFor="saveCard" className="ml-2 text-sm text-gray-700">
            Save card for future purchases
          </label>
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          disabled={loading}
          className="w-full py-3 bg-indigo-600 text-white font-bold rounded-lg hover:bg-indigo-700 transition-colors disabled:opacity-50"
        >
          {loading ? 'Processing...' : `Pay $${amount.toFixed(2)}`}
        </button>

        {/* Security Note */}
        <div className="flex items-center justify-center gap-2 text-xs text-gray-500">
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
          </svg>
          <span>Your payment information is secure and encrypted</span>
        </div>

        {/* Card Icons */}
        <div className="flex justify-center gap-4">
          <div className="w-12 h-8 bg-gray-100 rounded flex items-center justify-center text-xs text-gray-600">
            Visa
          </div>
          <div className="w-12 h-8 bg-gray-100 rounded flex items-center justify-center text-xs text-gray-600">
            MC
          </div>
          <div className="w-12 h-8 bg-gray-100 rounded flex items-center justify-center text-xs text-gray-600">
            Amex
          </div>
        </div>
      </form>
    </div>
  );
}
