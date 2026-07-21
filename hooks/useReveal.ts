'use client';

import { useEffect, useRef, useState } from 'react';
import { useReducedMotion } from './useReducedMotion';

/**
 * useReveal — "has this element been scrolled into view at least once?"
 *
 * Drives both the entrance animation of a timeline block and the moment its
 * marker lights up. Reveal is one-way on purpose: once a block has appeared it
 * stays revealed, so scrolling back up does not replay the page.
 *
 * Readers who prefer reduced motion are reported as revealed from the first
 * render, skipping the transition rather than being left with content that
 * never fades in.
 */
export function useReveal<T extends HTMLElement>(options?: { rootMargin?: string }) {
  const ref = useRef<T>(null);
  const [seen, setSeen] = useState(false);
  const reduced = useReducedMotion();

  const rootMargin = options?.rootMargin ?? '0px 0px -15% 0px';

  useEffect(() => {
    const node = ref.current;
    if (!node || reduced) return;

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries.some((e) => e.isIntersecting)) {
          setSeen(true);
          observer.disconnect();
        }
      },
      // threshold 0, not a fraction: a timeline block can be taller than the
      // viewport, and "10% of it visible" would then need a deliberate scroll
      // before the first block would ever appear. The negative bottom margin
      // in `rootMargin` is what delays the reveal, not a coverage ratio.
      { rootMargin, threshold: 0 },
    );
    observer.observe(node);
    return () => observer.disconnect();
  }, [rootMargin, reduced]);

  return { ref, revealed: reduced || seen };
}

/** Shared 0.7s fade-and-rise entrance. */
export const revealClass = (revealed: boolean) =>
  `transition-all duration-700 ease-out motion-reduce:transition-none ${
    revealed ? 'translate-y-0 opacity-100' : 'translate-y-6 opacity-0'
  }`;
