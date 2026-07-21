'use client';

import { useSyncExternalStore } from 'react';

/**
 * True when the reader has asked the system for reduced motion.
 *
 * Subscribed through useSyncExternalStore rather than an effect — the same
 * idiom as `useHasHover` in ProductGallery. The server snapshot stays `false`,
 * so SSR and the first client render agree, and no animation state has to be
 * written from inside an effect body.
 */
export function useReducedMotion(): boolean {
  return useSyncExternalStore(
    (onChange) => {
      const mq = window.matchMedia('(prefers-reduced-motion: reduce)');
      mq.addEventListener('change', onChange);
      return () => mq.removeEventListener('change', onChange);
    },
    () => window.matchMedia('(prefers-reduced-motion: reduce)').matches,
    () => false,
  );
}
