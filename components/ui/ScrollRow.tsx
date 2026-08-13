import type { ReactNode } from 'react';

interface ScrollRowProps {
  children: ReactNode;
  className?: string;
}

/**
 * ScrollRow — one horizontal strip of fixed-width cards.
 *
 * Below `lg` the strip bleeds out to the viewport edges so the last visible
 * card sits half-cut at the fold, which is what tells the reader the row
 * scrolls at all; from `lg` the row fits inside the container and the bleed is
 * cancelled. The paddings mirror `Container` (`px-6 md:px-12 lg:px-20`), so the
 * first card still lines up with the section heading above it.
 *
 * Belongs inside a `<Container>`, which is what the negative margins cancel.
 */
export function ScrollRow({ children, className = '' }: ScrollRowProps) {
  return (
    <div
      className={`-mx-6 flex gap-5 overflow-x-auto px-6 pb-2 md:-mx-12 md:px-12 lg:mx-0 lg:px-0 ${className}`}
    >
      {children}
    </div>
  );
}
