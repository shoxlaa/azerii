import Image from 'next/image';
import Link from 'next/link';
import type { Locale, Product } from '@/types';
import { formatPrice } from '@/lib/format';
import { Badge } from './ui/Badge';
import { CartIcon } from './icons';

interface ProductCardProps {
  product: Product;
  locale: Locale;
  statusLabel: string;
  scaleWord: string;
  addToCartLabel: string;
}

/** ProductCard — catalog grid item: image, status badge, name, scale, price. */
export function ProductCard({
  product,
  locale,
  statusLabel,
  scaleWord,
  addToCartLabel,
}: ProductCardProps) {
  const image = product.images[0];
  const name = product.name[locale] || product.name.en;
  // No purchase for out-of-stock or in-development items.
  const canBuy = product.status !== 'out_of_stock' && product.status !== 'in_development';

  return (
    <div className="group flex flex-col overflow-hidden rounded-md border border-border bg-panel transition-colors hover:border-gold/50">
      {/* Image */}
      <Link
        href={`/catalog/${product.slug}`}
        className="relative block aspect-[4/3] overflow-hidden bg-black/5 dark:bg-black/20"
      >
        {image ? (
          <Image
            src={image}
            alt={name}
            fill
            sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 320px"
            className="object-cover transition-transform duration-300 group-hover:scale-[1.04]"
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center text-subtle">
            <CartIcon className="h-8 w-8 opacity-30" />
          </div>
        )}
        <div className="absolute left-3 top-3">
          <Badge status={product.status} label={statusLabel} />
        </div>
      </Link>

      {/* Body */}
      <div className="flex flex-1 flex-col p-4">
        <Link href={`/catalog/${product.slug}`}>
          <h3 className="font-heading text-base font-semibold uppercase leading-tight tracking-wide text-heading transition-colors group-hover:text-gold">
            {name}
          </h3>
        </Link>
        <p className="mt-1 font-heading text-xs uppercase tracking-wide text-subtle">
          {product.scale} {scaleWord}
        </p>

        <div className="mt-4 flex items-center justify-between">
          <span className="font-heading text-xl font-semibold text-gold">
            {formatPrice(product.priceEur, locale)}
          </span>
          {canBuy ? (
            <button
              type="button"
              aria-label={addToCartLabel}
              className="flex h-9 w-9 items-center justify-center rounded-[4px] border border-border text-body transition-colors hover:border-gold hover:text-gold"
            >
              <CartIcon className="h-5 w-5" />
            </button>
          ) : null}
        </div>
      </div>
    </div>
  );
}
