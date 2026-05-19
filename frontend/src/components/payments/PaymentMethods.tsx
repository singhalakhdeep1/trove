'use client';

import { useState, useEffect } from 'react';
import { useStripe } from '@stripe/react-stripe-js';

interface SavedCard {
    id: string;
    brand: string;
    last4: string;
    expMonth: number;
    expYear: number;
    isDefault: boolean;
}

export default function PaymentMethods() {
    const stripe = useStripe();
    const [cards, setCards] = useState<SavedCard[]>([]);
    const [loading, setLoading] = useState(true);
    const [showAddCard, setShowAddCard] = useState(false);

    useEffect(() => {
        fetchPaymentMethods();
    }, []);

    const fetchPaymentMethods = async () => {
        try {
            const response = await fetch('/api/payments/methods');
            const data = await response.json();
            setCards(data.paymentMethods || []);
        } catch (error) {
            console.error('Failed to fetch payment methods:', error);
        } finally {
            setLoading(false);
        }
    };

    const removeCard = async (cardId: string) => {
        if (!confirm('Remove this payment method?')) return;

        try {
            const response = await fetch(`/api/payments/methods/${cardId}`, {
                method: 'DELETE',
            });

            if (response.ok) {
                setCards(cards.filter((card) => card.id !== cardId));
            }
        } catch (error) {
            console.error('Failed to remove card:', error);
        }
    };

    const setDefaultCard = async (cardId: string) => {
        try {
            const response = await fetch('/api/payments/methods/default', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ cardId }),
            });

            if (response.ok) {
                setCards(
                    cards.map((card) => ({
                        ...card,
                        isDefault: card.id === cardId,
                    }))
                );
            }
        } catch (error) {
            console.error('Failed to set default card:', error);
        }
    };

    const getCardIcon = (brand: string) => {
        const brandLower = brand.toLowerCase();
        if (brandLower === 'visa') return '💳';
        if (brandLower === 'mastercard') return '💳';
        if (brandLower === 'amex') return '💳';
        return '💳';
    };

    if (loading) {
        return <div className="text-center py-8">Loading payment methods...</div>;
    }

    return (
        <div className="space-y-4">
            <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold">Payment Methods</h3>
                <button
                    onClick={() => setShowAddCard(!showAddCard)}
                    className="text-blue-600 hover:text-blue-700 font-medium"
                >
                    + Add New Card
                </button>
            </div>

            {/* Saved Cards */}
            <div className="space-y-3">
                {cards.map((card) => (
                    <div
                        key={card.id}
                        className="flex items-center justify-between p-4 border border-gray-200 rounded-lg hover:border-gray-300 transition-colors"
                    >
                        <div className="flex items-center gap-3">
                            <span className="text-2xl">{getCardIcon(card.brand)}</span>
                            <div>
                                <div className="font-medium">
                                    {card.brand.charAt(0).toUpperCase() + card.brand.slice(1)} •••• {card.last4}
                                </div>
                                <div className="text-sm text-gray-500">
                                    Expires {card.expMonth}/{card.expYear}
                                </div>
                            </div>
                            {card.isDefault && (
                                <span className="px-2 py-1 bg-blue-100 text-blue-700 text-xs rounded">
                                    Default
                                </span>
                            )}
                        </div>

                        <div className="flex gap-2">
                            {!card.isDefault && (
                                <button
                                    onClick={() => setDefaultCard(card.id)}
                                    className="text-sm text-gray-600 hover:text-gray-800"
                                >
                                    Set Default
                                </button>
                            )}
                            <button
                                onClick={() => removeCard(card.id)}
                                className="text-sm text-red-600 hover:text-red-700"
                            >
                                Remove
                            </button>
                        </div>
                    </div>
                ))}

                {cards.length === 0 && (
                    <div className="text-center py-8 text-gray-500">
                        No payment methods saved
                    </div>
                )}
            </div>

            {/* Add Card Form */}
            {showAddCard && (
                <div className="border border-gray-200 rounded-lg p-4">
                    <h4 className="font-medium mb-3">Add New Card</h4>
                    {/* Add Stripe SetupIntent form here */}
                    <p className="text-sm text-gray-500">
                        Card setup form would go here using Stripe SetupIntent
                    </p>
                </div>
            )}
        </div>
    );
}
