import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export interface WishlistItem {
    id: string;
    productId: string;
    name: string;
    price: number;
    image?: string;
    addedAt: string;
}

interface WishlistState {
    items: WishlistItem[];

    // Actions
    addItem: (item: Omit<WishlistItem, 'id' | 'addedAt'>) => void;
    removeItem: (productId: string) => void;
    clearWishlist: () => void;
    isInWishlist: (productId: string) => boolean;
}

export const useWishlistStore = create<WishlistState>()(
    persist(
        (set, get) => ({
            items: [],

            addItem: (item: Omit<WishlistItem, 'id' | 'addedAt'>) => {
                const { items } = get();

                // Check if already in wishlist
                if (items.some((i) => i.productId === item.productId)) {
                    return;
                }

                const newItem: WishlistItem = {
                    ...item,
                    id: `wishlist-${item.productId}-${Date.now()}`,
                    addedAt: new Date().toISOString(),
                };

                set({ items: [...items, newItem] });
            },

            removeItem: (productId: string) => {
                const { items } = get();
                set({ items: items.filter((item) => item.productId !== productId) });
            },

            clearWishlist: () => {
                set({ items: [] });
            },

            isInWishlist: (productId: string) => {
                const { items } = get();
                return items.some((item) => item.productId === productId);
            },
        }),
        {
            name: 'wishlist-storage',
        }
    )
);
