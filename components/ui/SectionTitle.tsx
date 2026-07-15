import type { ReactNode } from 'react';

interface SectionTitleProps {
  children: ReactNode;
  /** Optional action rendered on the right (e.g. a "view all" link). */
  action?: ReactNode;
  className?: string;
}

/**
 * SectionTitle — uppercase section heading (28px) with an optional
 * right-aligned action slot.
 */
export function SectionTitle({
  children,
  action,
  className = '',
}: SectionTitleProps) {
  return (
    <div
      className={`flex flex-col gap-2 sm:flex-row sm:items-baseline sm:justify-between sm:gap-4 ${className}`}
    >
      <h2 className="font-heading text-[28px] font-bold uppercase tracking-wide text-heading">
        {children}
      </h2>
      {action ? <div className="shrink-0">{action}</div> : null}
    </div>
  );
}
