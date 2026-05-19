import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export interface CartItem {
    id: string;
    productId: string;
    name: string;
    price: number;
    quantity: number;
    image?: string;
    variantId?: string;
    variant?: string;
    sellerId: string;
}

interface CartState {
    items: CartItem[];
    total: number;
    itemCount: number;

    // Actions
    addItem: (item: Omit<CartItem, 'id'>) => void;
    removeItem: (id: string) => void;
    updateQuantity: (id: string, quantity: number) => void;
    clearCart: () => void;
    calculateTotal: () => void;
}

export const useCartStore = create<CartState>()(
    persist(
        (set, get) => ({
            items: [],
            total: 0,
            itemCount: 0,

            addItem: (item: Omit<CartItem, 'id'>) => {
                const { items } = get();

                // Check if item already exists
                const existingItem = items.find(
                    (i) => i.productId === item.productId && i.variantId === item.variantId
                );

                if (existingItem) {
                    // Update quantity
                    set({
                        items: items.map((i) =>
                            i.id === existingItem.id
                                ? { ...i, quantity: i.quantity + item.quantity }
                                : i
                        ),
                    });
                } else {
                    // Add new item
                    const newItem: CartItem = {
                        ...item,
                        id: `${item.productId}-${item.variantId || 'default'}-${Date.now()}`,
                    };
                    set({ items: [...items, newItem] });
                }

                get().calculateTotal();
            },

            removeItem: (id: string) => {
                const { items } = get();
                set({ items: items.filter((item) => item.id !== id) });
                get().calculateTotal();
            },

            updateQuantity: (id: string, quantity: number) => {
                const { items } = get();

                if (quantity <= 0) {
                    get().removeItem(id);
                    return;
                }

                set({
                    items: items.map((item) =>
                        item.id === id ? { ...item, quantity } : item
                    ),
                });
                get().calculateTotal();
            },

            clearCart: () => {
                set({ items: [], total: 0, itemCount: 0 });
            },

            calculateTotal: () => {
                const { items } = get();
                const total = items.reduce((sum, item) => sum + item.price * item.quantity, 0);
                const itemCount = items.reduce((sum, item) => sum + item.quantity, 0);
                set({ total, itemCount });
            },
        }),
        {
            name: 'cart-storage',
        }
    )
);
