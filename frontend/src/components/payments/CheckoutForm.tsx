'use client';

import { useState, FormEvent } from 'react';
import {
    useStripe,
    useElements,
    PaymentElement,
    AddressElement,
} from '@stripe/react-stripe-js';

interface CheckoutFormProps {
    onSuccess: (paymentIntent: any) => void;
    onError: (error: string) => void;
}

export default function CheckoutForm({ onSuccess, onError }: CheckoutFormProps) {
    const stripe = useStripe();
    const elements = useElements();
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState<string>('');

    const handleSubmit = async (e: FormEvent) => {
        e.preventDefault();

        if (!stripe || !elements) {
            return;
        }

        setLoading(true);
        setMessage('');

        try {
            const { error, paymentIntent } = await stripe.confirmPayment({
                elements,
                confirmParams: {
                    return_url: `${window.location.origin}/checkout/success`,
                },
                redirect: 'if_required',
            });

            if (error) {
                setMessage(error.message || 'Payment failed');
                onError(error.message || 'Payment failed');
            } else if (paymentIntent && paymentIntent.status === 'succeeded') {
                setMessage('Payment successful!');
                onSuccess(paymentIntent);
            }
        } catch (err: any) {
            setMessage('An unexpected error occurred.');
            onError(err.message || 'An unexpected error occurred.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-6">
            {/* Billing Address */}
            <div>
                <h3 className="text-lg font-medium mb-3">Billing Address</h3>
                <AddressElement
                    options={{
                        mode: 'billing',
                    }}
                />
            </div>

            {/* Payment Details */}
            <div>
                <h3 className="text-lg font-medium mb-3">Payment Details</h3>
                <PaymentElement />
            </div>

            {/* Error/Success Message */}
            {message && (
                <div
                    className={`p-4 rounded-lg ${message.includes('successful')
                            ? 'bg-green-50 text-green-700 border border-green-200'
                            : 'bg-red-50 text-red-700 border border-red-200'
                        }`}
                >
                    {message}
                </div>
            )}

            {/* Submit Button */}
            <button
                type="submit"
                disabled={!stripe || loading}
                className="w-full bg-blue-600 text-white py-3 px-4 rounded-lg hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed font-medium transition-colors"
            >
                {loading ? (
                    <span className="flex items-center justify-center gap-2">
                        <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                            <circle
                                className="opacity-25"
                                cx="12"
                                cy="12"
                                r="10"
                                stroke="currentColor"
                                strokeWidth="4"
                                fill="none"
                            />
                            <path
                                className="opacity-75"
                                fill="currentColor"
                                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                            />
                        </svg>
                        Processing...
                    </span>
                ) : (
                    'Pay Now'
                )}
            </button>

            {/* Secure Payment Badge */}
            <div className="flex items-center justify-center gap-2 text-sm text-gray-500">
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                    <path
                        fillRule="evenodd"
                        d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z"
                        clipRule="evenodd"
                    />
                </svg>
                Secured by Stripe
            </div>
        </form>
    );
}
