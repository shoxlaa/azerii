'use client';

/**
 * Cart state (Zustand + localStorage persistence).
 *
 * Persistence is deliberately hydrated *after* mount (`skipHydration: true`)
 * so the server-rendered HTML and the first client render always agree (an
 * empty cart). `useCartHydrated()` reports when the stored cart has been read,
 * so UI can avoid flashing an "empty cart" state. <CartHydrator /> (mounted in
 * the root layout) kicks off the rehydration.
 */

import { useSyncExternalStore } from 'react';
import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';
import type { CartItem } from '@/types';
import { roundMoney } from '@/lib/format';

/** Quantity bounds for a single line item. */
export const MIN_QTY = 1;
export const MAX_QTY = 99;

const clampQty = (qty: number) => Math.min(MAX_QTY, Math.max(MIN_QTY, Math.round(qty)));

interface CartState {
  items: CartItem[];
  /** Add a product, or bump its quantity if already in the cart. */
  addItem: (item: Omit<CartItem, 'quantity'>, qty?: number) => void;
  /** Drop a line item entirely. */
  removeItem: (productId: string) => void;
  /** Set an explicit quantity (clamped); 0 or less removes the line. */
  updateQty: (productId: string, qty: number) => void;
  /** Empty the cart. */
  clear: () => void;
  /** Order total in EUR. */
  totalEUR: () => number;
  /** Total number of units across all lines (header badge). */
  count: () => number;
}

export const useCart = create<CartState>()(
  persist(
    (set, get) => ({
      items: [],

      addItem: (item, qty = 1) =>
        set((state) => {
          const existing = state.items.find((i) => i.productId === item.productId);
          if (existing) {
            return {
              items: state.items.map((i) =>
                i.productId === item.productId
                  ? { ...i, quantity: clampQty(i.quantity + qty) }
                  : i,
              ),
            };
          }
          return { items: [...state.items, { ...item, quantity: clampQty(qty) }] };
        }),

      removeItem: (productId) =>
        set((state) => ({ items: state.items.filter((i) => i.productId !== productId) })),

      updateQty: (productId, qty) =>
        set((state) =>
          qty < MIN_QTY
            ? { items: state.items.filter((i) => i.productId !== productId) }
            : {
                items: state.items.map((i) =>
                  i.productId === productId ? { ...i, quantity: clampQty(qty) } : i,
                ),
              },
        ),

      clear: () => set({ items: [] }),

      totalEUR: () =>
        roundMoney(get().items.reduce((sum, i) => sum + i.priceEur * i.quantity, 0)),

      count: () => get().items.reduce((n, i) => n + i.quantity, 0),
    }),
    {
      name: 'azerii-cart',
      storage: createJSONStorage(() => localStorage),
      // Only the line items are persisted; methods are recreated by the store.
      partialize: (state) => ({ items: state.items }),
      skipHydration: true,
    },
  ),
);

/**
 * True once the persisted cart has been read from localStorage.
 *
 * Uses useSyncExternalStore so the server snapshot is always `false` — this
 * keeps SSR output and the first client render identical.
 */
export function useCartHydrated(): boolean {
  return useSyncExternalStore(
    (onChange) => useCart.persist.onFinishHydration(onChange),
    () => useCart.persist.hasHydrated(),
    () => false,
  );
}
