'use client';

import { useState } from 'react';
import { loadStripe } from '@stripe/stripe-js';
import { Elements } from '@stripe/react-stripe-js';
import CheckoutForm from './CheckoutForm';

const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY || '');

interface StripePaymentProps {
    amount: number;
    currency?: string;
    orderId: string;
    onSuccess: (paymentIntent: any) => void;
    onError: (error: string) => void;
}

export default function StripePayment({
    amount,
    currency = 'usd',
    orderId,
    onSuccess,
    onError,
}: StripePaymentProps) {
    const [clientSecret, setClientSecret] = useState<string>('');
    const [loading, setLoading] = useState(false);

    const createPaymentIntent = async () => {
        setLoading(true);
        try {
            const response = await fetch('/api/payments/create-intent', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ amount, currency, orderId }),
            });

            if (!response.ok) throw new Error('Failed to create payment intent');

            const data = await response.json();
            setClientSecret(data.clientSecret);
        } catch (error: any) {
            onError(error.message || 'Failed to initialize payment');
        } finally {
            setLoading(false);
        }
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center py-8">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
            </div>
        );
    }

    if (!clientSecret) {
        return (
            <button
                onClick={createPaymentIntent}
                className="w-full bg-blue-600 text-white py-3 px-4 rounded-lg hover:bg-blue-700 font-medium"
            >
                Proceed to Payment
            </button>
        );
    }

    return (
        <Elements
            stripe={stripePromise}
            options={{
                clientSecret,
                appearance: {
                    theme: 'stripe',
                    variables: {
                        colorPrimary: '#2563eb',
                    },
                },
            }}
        >
            <CheckoutForm onSuccess={onSuccess} onError={onError} />
        </Elements>
    );
}
