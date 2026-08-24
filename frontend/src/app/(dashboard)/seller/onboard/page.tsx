'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

interface OnboardingData {
  businessName: string;
  businessType: string;
  taxId: string;
  email: string;
  phone: string;
  address: {
    street: string;
    city: string;
    state: string;
    zipCode: string;
    country: string;
  };
}

export default function SellerOnboardingPage() {
  const router = useRouter();
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [onboardingData, setOnboardingData] = useState<OnboardingData>({
    businessName: '',
    businessType: '',
    taxId: '',
    email: '',
    phone: '',
    address: {
      street: '',
      city: '',
      state: '',
      zipCode: '',
      country: 'USA',
    },
  });
  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const [stripeLink, setStripeLink] = useState<string | null>(null);

  const handleStep1Submit = (e: React.FormEvent) => {
    e.preventDefault();
    const newErrors: { [key: string]: string } = {};

    if (!onboardingData.businessName.trim()) newErrors.businessName = 'Business name is required';
    if (!onboardingData.businessType.trim()) newErrors.businessType = 'Business type is required';
    if (!onboardingData.email.trim()) newErrors.email = 'Email is required';
    if (!onboardingData.phone.trim()) newErrors.phone = 'Phone is required';

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    setErrors({});
    setStep(2);
  };

  const handleStep2Submit = (e: React.FormEvent) => {
    e.preventDefault();
    const newErrors: { [key: string]: string } = {};

    if (!onboardingData.address.street.trim()) newErrors.street = 'Street address is required';
    if (!onboardingData.address.city.trim()) newErrors.city = 'City is required';
    if (!onboardingData.address.state.trim()) newErrors.state = 'State is required';
    if (!onboardingData.address.zipCode.trim()) newErrors.zipCode = 'ZIP code is required';

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    setErrors({});
    setStep(3);
  };

  const handleStripeConnect = async () => {
    setLoading(true);
    try {
      // TODO: Replace with actual API call
      // const response = await fetch('/api/seller/onboard', {
      //   method: 'POST',
      //   body: JSON.stringify(onboardingData),
      // });
      // const data = await response.json();
      // setStripeLink(data.stripeLink);
      
      // Mock Stripe link for now
      setStripeLink('https://connect.stripe.com/oauth/authorize?mock=true');
    } catch (error) {
      console.error('Error creating Stripe account:', error);
      setErrors({ submit: 'Failed to create Stripe account. Please try again.' });
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (field: keyof OnboardingData | keyof OnboardingData['address'], value: string) => {
    if (field in onboardingData.address) {
      setOnboardingData(prev => ({
        ...prev,
        address: { ...prev.address, [field]: value },
      }));
    } else {
      setOnboardingData(prev => ({ ...prev, [field]: value }));
    }
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  const progress = (step / 3) * 100;

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Become a Seller</h1>
          <p className="mt-2 text-gray-600">Complete your seller profile to start selling on Trove</p>
        </div>

        {/* Progress Bar */}
        <div className="mb-8">
          <div className="flex justify-between text-sm text-gray-600 mb-2">
            <span>Step {step} of 3</span>
            <span>{Math.round(progress)}% Complete</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div className="bg-indigo-600 h-2 rounded-full transition-all duration-300" style={{ width: `${progress}%` }}></div>
          </div>
        </div>

        {/* Step 1: Business Information */}
        {step === 1 && (
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-xl font-semibold mb-4">Business Information</h2>
            <form onSubmit={handleStep1Submit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Business Name *
                </label>
                <input
                  type="text"
                  value={onboardingData.businessName}
                  onChange={(e) => handleChange('businessName', e.target.value)}
                  placeholder="My Awesome Store"
                  className={cn(
                    'w-full px-3 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-indigo-500',
                    errors.businessName && 'border-red-500'
                  )}
                />
                {errors.businessName && (
                  <p className="text-red-500 text-sm mt-1">{errors.businessName}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Business Type *
                </label>
                <select
                  value={onboardingData.businessType}
                  onChange={(e) => handleChange('businessType', e.target.value)}
                  className={cn(
                    'w-full px-3 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-indigo-500',
                    errors.businessType && 'border-red-500'
                  )}
                >
                  <option value="">Select business type</option>
                  <option value="sole_proprietorship">Sole Proprietorship</option>
                  <option value="llc">LLC</option>
                  <option value="corporation">Corporation</option>
                  <option value="partnership">Partnership</option>
                  <option value="non_profit">Non-Profit</option>
                </select>
                {errors.businessType && (
                  <p className="text-red-500 text-sm mt-1">{errors.businessType}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Tax ID (EIN) (optional)
                </label>
                <input
                  type="text"
                  value={onboardingData.taxId}
                  onChange={(e) => handleChange('taxId', e.target.value)}
                  placeholder="12-3456789"
                  className="w-full px-3 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Business Email *
                </label>
                <input
                  type="email"
                  value={onboardingData.email}
                  onChange={(e) => handleChange('email', e.target.value)}
                  placeholder="business@example.com"
                  className={cn(
                    'w-full px-3 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-indigo-500',
                    errors.email && 'border-red-500'
                  )}
                />
                {errors.email && (
                  <p className="text-red-500 text-sm mt-1">{errors.email}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Business Phone *
                </label>
                <input
                  type="tel"
                  value={onboardingData.phone}
                  onChange={(e) => handleChange('phone', e.target.value)}
                  placeholder="(555) 123-4567"
                  className={cn(
                    'w-full px-3 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-indigo-500',
                    errors.phone && 'border-red-500'
                  )}
                />
                {errors.phone && (
                  <p className="text-red-500 text-sm mt-1">{errors.phone}</p>
                )}
              </div>

              <div className="flex justify-end">
                <button
                  type="submit"
                  className="px-6 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700"
                >
                  Continue
                </button>
              </div>
            </form>
          </div>
        )}

        {/* Step 2: Address */}
        {step === 2 && (
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-xl font-semibold mb-4">Business Address</h2>
            <form onSubmit={handleStep2Submit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Street Address *
                </label>
                <input
                  type="text"
                  value={onboardingData.address.street}
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

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    City *
                  </label>
                  <input
                    type="text"
                    value={onboardingData.address.city}
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

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    State *
                  </label>
                  <input
                    type="text"
                    value={onboardingData.address.state}
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
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    ZIP Code *
                  </label>
                  <input
                    type="text"
                    value={onboardingData.address.zipCode}
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

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Country *
                  </label>
                  <select
                    value={onboardingData.address.country}
                    onChange={(e) => handleChange('country', e.target.value)}
                    className="w-full px-3 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  >
                    <option value="USA">United States</option>
                    <option value="CAN">Canada</option>
                    <option value="GBR">United Kingdom</option>
                    <option value="AUS">Australia</option>
                  </select>
                </div>
              </div>

              <div className="flex justify-between">
                <button
                  type="button"
                  onClick={() => setStep(1)}
                  className="px-6 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
                >
                  Back
                </button>
                <button
                  type="submit"
                  className="px-6 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700"
                >
                  Continue
                </button>
              </div>
            </form>
          </div>
        )}

        {/* Step 3: Stripe Connect */}
        {step === 3 && (
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-xl font-semibold mb-4">Connect Your Payment Account</h2>
            <div className="space-y-4">
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <h3 className="font-medium text-blue-900 mb-2">Why connect with Stripe?</h3>
                <ul className="text-sm text-blue-800 space-y-1">
                  <li>• Secure and reliable payment processing</li>
                  <li>• Automatic payouts to your bank account</li>
                  <li>• Support for all major credit cards</li>
                  <li>• Built-in fraud protection</li>
                </ul>
              </div>

              <div className="text-sm text-gray-600">
                <p className="font-medium mb-2">Review your information:</p>
                <div className="bg-gray-50 rounded p-3 space-y-1">
                  <p><span className="font-medium">Business:</span> {onboardingData.businessName}</p>
                  <p><span className="font-medium">Type:</span> {onboardingData.businessType}</p>
                  <p><span className="font-medium">Email:</span> {onboardingData.email}</p>
                  <p><span className="font-medium">Address:</span> {onboardingData.address.street}, {onboardingData.address.city}, {onboardingData.address.state} {onboardingData.address.zipCode}</p>
                </div>
              </div>

              {errors.submit && (
                <p className="text-red-500 text-sm">{errors.submit}</p>
              )}

              <div className="flex justify-between">
                <button
                  type="button"
                  onClick={() => setStep(2)}
                  className="px-6 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
                >
                  Back
                </button>
                <button
                  onClick={handleStripeConnect}
                  disabled={loading}
                  className="px-6 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 disabled:opacity-50 flex items-center gap-2"
                >
                  {loading ? 'Creating Account...' : 'Connect with Stripe'}
                  {!loading && (
                    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M13.976 9.15c-2.172-.806-3.356-1.426-3.356-2.409 0-.831.683-1.305 1.901-1.305 2.227 0 4.515.858 6.09 1.631l.89-5.494C18.252.975 15.697 0 12.165 0 9.667 0 7.589.757 6.104 2.293 4.56 3.885 4.4 6.517 4.4 8.318c0 4.039 2.467 5.76 6.476 7.219 2.585.92 3.445 1.574 3.445 2.553 0 .98-.8 1.545-2.294 1.545-1.977 0-4.918-.972-6.88-2.062l-.9 5.635C5.175 23.242 7.895 24 11.395 24c2.5 0 4.58-.58 6.08-1.876 1.684-1.465 2.56-3.68 2.56-6.59 0-4.044-2.5-5.732-6.059-7.384z"/>
                    </svg>
                  )}
                </button>
              </div>

              {stripeLink && (
                <div className="mt-4 p-4 bg-green-50 border border-green-200 rounded-lg">
                  <p className="text-green-800 font-medium">Stripe account created!</p>
                  <p className="text-green-700 text-sm mt-1">
                    You will be redirected to Stripe to complete your onboarding.
                  </p>
                  <a
                    href={stripeLink}
                    className="inline-block mt-3 px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700"
                  >
                    Continue to Stripe
                  </a>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

function cn(...classes: (string | undefined | boolean)[]): string {
  return classes.filter(Boolean).join(' ');
}
