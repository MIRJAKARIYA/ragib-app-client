// src/store/useCartStore.js
import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export const useCartStore = create(
  persist(
    (set, get) => ({
      items: [],

      // Add item to cart
      addItem: (product) =>
        set((state) => {
          const existing = state.items.find((item) => item._id === product._id);
          if (existing) {
            return {
              items: state.items.map((item) =>
                item._id === product._id
                  ? { ...item, qty: item.qty + 1 }
                  : item
              ),
            };
          }
          return {
            items: [...state.items, { ...product, qty: 1 }],
          };
        }),

      // Remove item completely
      removeItem: (id) =>
        set((state) => ({
          items: state.items.filter((item) => item._id !== id),
        })),

      // Update quantity (+ / -)
      updateQty: (id, qty) =>
        set((state) => {
          if (qty <= 0) {
            return {
              items: state.items.filter((item) => item._id !== id),
            };
          }
          return {
            items: state.items.map((item) =>
              item._id === id ? { ...item, qty } : item
            ),
          };
        }),

      // Clear entire cart
      clearCart: () => set({ items: [] }),

      // Helper: Total items count (for badge)
      getTotalItems: () => {
        return get().items.reduce((sum, item) => sum + item.qty, 0);
      },

      // Helper: Total price
      getTotalPrice: () => {
        return get().items.reduce((sum, item) => sum + item.price * item.qty, 0);
      },
    }),
    {
      name: "laobaan-cart-storage", // unique name for localStorage
      partialize: (state) => ({ items: state.items }), // only persist items
    }
  )
);