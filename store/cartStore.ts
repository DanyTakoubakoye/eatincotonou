import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export interface CartItem {
    id: string;
    mealId: string;
    mealName: string;
    price: number;
    quantity: number;
    specialNotes?: string;
    restaurantId: string;
    restaurantName: string;
    restaurantLogo?: string;
    image?: string;
}

interface CartStore {
    items: CartItem[];

    // Actions
    addToCart: (item: CartItem) => void;
    removeFromCart: (mealId: string) => void;
    updateQuantity: (mealId: string, quantity: number) => void;
    clearCart: () => void;

    // Getters
    getTotalPrice: () => number;
    getTotalItems: () => number;
}

export const useCartStore = create<CartStore>()(
    persist(
        (set, get) => ({
            items: [],

            addToCart: (newItem: CartItem) => {
                set((state) => {
                    const existingItem = state.items.find(
                        (item) => item.mealId === newItem.mealId
                    );

                    if (existingItem) {
                        // Si plat existe déjà, augmenter la quantité
                        return {
                            items: state.items.map((item) =>
                                item.mealId === newItem.mealId
                                    ? { ...item, quantity: item.quantity + newItem.quantity }
                                    : item
                            ),
                        };
                    } else {
                        // Sinon ajouter nouveau plat
                        return {
                            items: [...state.items, newItem],
                        };
                    }
                });
            },

            removeFromCart: (mealId: string) => {
                set((state) => ({
                    items: state.items.filter((item) => item.mealId !== mealId),
                }));
            },

            updateQuantity: (mealId: string, quantity: number) => {
                set((state) => {
                    if (quantity <= 0) {
                        return {
                            items: state.items.filter((item) => item.mealId !== mealId),
                        };
                    }
                    return {
                        items: state.items.map((item) =>
                            item.mealId === mealId ? { ...item, quantity } : item
                        ),
                    };
                });
            },

            clearCart: () => {
                set({ items: [] });
            },

            getTotalPrice: () => {
                return get().items.reduce(
                    (total, item) => total + item.price * item.quantity,
                    0
                );
            },

            getTotalItems: () => {
                return get().items.reduce((total, item) => total + item.quantity, 0);
            },
        }),
        {
            name: 'cart-storage', // Nom de la clé localStorage
        }
    )
);