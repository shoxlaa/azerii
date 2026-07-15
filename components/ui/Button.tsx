import type { ButtonHTMLAttributes, ReactNode } from 'react';

type ButtonVariant = 'buy' | 'cart';

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  children: ReactNode;
}

const base =
  'inline-flex items-center justify-center gap-2 rounded-[4px] font-heading font-semibold uppercase tracking-wide transition-colors duration-200 disabled:cursor-not-allowed disabled:opacity-50';

const variants: Record<ButtonVariant, string> = {
  // Primary "buy" — solid gold (static bg), black text, 220×52.
  buy: 'h-[52px] w-[220px] bg-gold-bg text-black hover:bg-gold-bg-hover',
  // Secondary "cart" — transparent, themeable gold outline & text; fills on hover.
  cart: 'h-[52px] px-6 border border-gold bg-transparent text-gold hover:bg-gold-bg hover:text-black',
};

/**
 * Button — primary UI button with `buy` and `cart` variants.
 */
export function Button({
  variant = 'buy',
  className = '',
  children,
  ...props
}: ButtonProps) {
  return (
    <button className={`${base} ${variants[variant]} ${className}`} {...props}>
      {children}
    </button>
  );
}
