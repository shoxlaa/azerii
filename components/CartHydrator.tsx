'use client';

import { useEffect } from 'react';
import { useCart } from '@/hooks/useCart';

/**
 * Reads the persisted cart out of localStorage once, after mount.
 * Renders nothing — it only exists so the store's `skipHydration` cart is
 * restored without causing an SSR/client markup mismatch.
 */
export function CartHydrator() {
  useEffect(() => {
    void useCart.persist.rehydrate();
  }, []);
  return null;
}
