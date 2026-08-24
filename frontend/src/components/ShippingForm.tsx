'use client';

import { useState } from 'react';
import { cn } from '@/lib/utils';

interface Address {
  firstName: string;
  lastName: string;
  street: string;
  apartment?: string;
  city: string;
  state: string;
  zipCode: string;
  country: string;
  phone?: string;
}

interface ShippingFormProps {
  className?: string;
  initialAddress?: Address;
  onSubmit: (address: Address) => void;
  loading?: boolean;
}

export default function ShippingForm({ 
  className, 
  initialAddress,
  onSubmit,
  loading = false 
}: ShippingFormProps) {
  const [address, setAddress] = useState<Address>(
    initialAddress || {
      firstName: '',
      lastName: '',
      street: '',
      apartment: '',
      city: '',
      state: '',
      zipCode: '',
      country: 'USA',
      phone: '',
    }
  );
  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const [saveAsDefault, setSaveAsDefault] = useState(false);

  const handleChange = (field: keyof Address, value: string) => {
    setAddress(prev => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const newErrors: { [key: string]: string } = {};

    if (!address.firstName.trim()) newErrors.firstName = 'First name is required';
    if (!address.lastName.trim()) newErrors.lastName = 'Last name is required';
    if (!address.street.trim()) newErrors.street = 'Street address is required';
    if (!address.city.trim()) newErrors.city = 'City is required';
    if (!address.state.trim()) newErrors.state = 'State is required';
    if (!address.zipCode.trim()) newErrors.zipCode = 'ZIP code is required';
    if (!address.country.trim()) newErrors.country = 'Country is required';

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    onSubmit({ ...address, saveAsDefault } as any);
  };

  return (
    <div className={cn('p-6 bg-white rounded-lg shadow-sm border border-gray-100', className)}>
      <h2 className="text-xl font-bold text-gray-900 mb-4">Shipping Information</h2>
      
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* First Name */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              First Name *
            </label>
            <input
              type="text"
              value={address.firstName}
              onChange={(e) => handleChange('firstName', e.target.value)}
              placeholder="John"
              className={cn(
                'w-full px-3 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-indigo-500',
                errors.firstName && 'border-red-500'
              )}
            />
            {errors.firstName && (
              <p className="text-red-500 text-sm mt-1">{errors.firstName}</p>
            )}
          </div>

          {/* Last Name */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Last Name *
            </label>
            <input
              type="text"
              value={address.lastName}
              onChange={(e) => handleChange('lastName', e.target.value)}
              placeholder="Doe"
              className={cn(
                'w-full px-3 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-indigo-500',
                errors.lastName && 'border-red-500'
              )}
            />
            {errors.lastName && (
              <p className="text-red-500 text-sm mt-1">{errors.lastName}</p>
            )}
          </div>

          {/* Street Address */}
          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Street Address *
            </label>
            <input
              type="text"
              value={address.street}
              onChange={(e) => handleChange('street', e.target.value)}
              placeholder="123 Main St"
              className={cn(
                'w-full px-3 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-indigo-500',
                errors.street && 'border-red-500'
              )}
            />
            {errors.street && (
              <p className="text-red-500 text-sm mt-1">{errors.street}</p>
            )}
          </div>

          {/* Apartment */}
          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Apartment, suite, etc. (optional)
            </label>
            <input
              type="text"
              value={address.apartment || ''}
              onChange={(e) => handleChange('apartment', e.target.value)}
              placeholder="Apt 4B"
              className="w-full px-3 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>

          {/* City */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              City *
            </label>
            <input
              type="text"
              value={address.city}
              onChange={(e) => handleChange('city', e.target.value)}
              placeholder="San Francisco"
              className={cn(
                'w-full px-3 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-indigo-500',
                errors.city && 'border-red-500'
              )}
            />
            {errors.city && (
              <p className="text-red-500 text-sm mt-1">{errors.city}</p>
            )}
          </div>

          {/* State */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              State *
            </label>
            <input
              type="text"
              value={address.state}
              onChange={(e) => handleChange('state', e.target.value)}
              placeholder="CA"
              className={cn(
                'w-full px-3 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-indigo-500',
                errors.state && 'border-red-500'
              )}
            />
            {errors.state && (
              <p className="text-red-500 text-sm mt-1">{errors.state}</p>
            )}
          </div>

          {/* ZIP Code */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              ZIP Code *
            </label>
            <input
              type="text"
              value={address.zipCode}
              onChange={(e) => handleChange('zipCode', e.target.value)}
              placeholder="94105"
              className={cn(
                'w-full px-3 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-indigo-500',
                errors.zipCode && 'border-red-500'
              )}
            />
            {errors.zipCode && (
              <p className="text-red-500 text-sm mt-1">{errors.zipCode}</p>
            )}
          </div>

          {/* Country */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Country *
            </label>
            <select
              value={address.country}
              onChange={(e) => handleChange('country', e.target.value)}
              className={cn(
                'w-full px-3 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-indigo-500',
                errors.country && 'border-red-500'
              )}
            >
              <option value="USA">United States</option>
              <option value="CAN">Canada</option>
              <option value="GBR">United Kingdom</option>
              <option value="AUS">Australia</option>
              <option value="DEU">Germany</option>
              <option value="FRA">France</option>
              <option value="OTHER">Other</option>
            </select>
            {errors.country && (
              <p className="text-red-500 text-sm mt-1">{errors.country}</p>
            )}
          </div>

          {/* Phone */}
          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Phone (optional)
            </label>
            <input
              type="tel"
              value={address.phone || ''}
              onChange={(e) => handleChange('phone', e.target.value)}
              placeholder="(555) 123-4567"
              className="w-full px-3 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>
        </div>

        {/* Save as Default */}
        <div className="flex items-center">
          <input
            type="checkbox"
            id="saveAsDefault"
            checked={saveAsDefault}
            onChange={(e) => setSaveAsDefault(e.target.checked)}
            className="w-4 h-4 text-indigo-600 border-gray-300 rounded focus:ring-indigo-500"
          />
          <label htmlFor="saveAsDefault" className="ml-2 text-sm text-gray-700">
            Save as default shipping address
          </label>
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          disabled={loading}
          className="w-full py-3 bg-indigo-600 text-white font-bold rounded-lg hover:bg-indigo-700 transition-colors disabled:opacity-50"
        >
          {loading ? 'Saving...' : 'Continue to Payment'}
        </button>
      </form>
    </div>
  );
}
