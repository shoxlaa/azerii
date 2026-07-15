import type { ProductStatus } from '@/types';

interface BadgeProps {
  /** Product status — selects the badge color. */
  status: ProductStatus;
  /** Visible label (already localized by the caller). */
  label: string;
  className?: string;
}

/** Tailwind background class per status (colors defined in globals.css @theme). */
const STATUS_BG: Record<ProductStatus, string> = {
  in_stock: 'bg-status-in-stock',
  out_of_stock: 'bg-status-out-of-stock',
  coming_soon: 'bg-status-coming-soon',
  planned: 'bg-status-planned',
  discontinued: 'bg-status-discontinued',
  limited: 'bg-status-limited',
  in_development: 'bg-status-in-development',
};

/**
 * Badge — product status label.
 *
 * Small uppercase condensed pill, colored by status.
 */
export function Badge({ status, label, className = '' }: BadgeProps) {
  return (
    <span
      className={`inline-flex items-center rounded-[3px] px-2.5 py-1 font-heading text-[11px] font-semibold uppercase leading-none tracking-wide text-white ${STATUS_BG[status]} ${className}`}
    >
      {label}
    </span>
  );
}
