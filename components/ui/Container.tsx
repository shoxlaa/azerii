import type { ReactNode } from 'react';

interface ContainerProps {
  children: ReactNode;
  className?: string;
}

/**
 * Container — centered content column.
 *
 * max-width 1200px, centered, with responsive side padding
 * (80px on desktop, less on tablet/mobile).
 */
export function Container({ children, className = '' }: ContainerProps) {
  return (
    <div
      className={`mx-auto w-full max-w-[var(--container-site)] px-6 md:px-12 lg:px-20 ${className}`}
    >
      {children}
    </div>
  );
}
