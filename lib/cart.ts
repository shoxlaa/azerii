import type { CartItem, Product } from '@/types';

/**
 * A cart line merged with current catalog data.
 *
 * The cart is persisted in localStorage, so its stored name/price/image are a
 * snapshot from whenever the item was added. They go stale whenever a product
 * is re-photographed, renamed or repriced — which would otherwise show a
 * broken image or an out-of-date price at checkout. Display always uses the
 * live catalog; only `quantity` and `productId` come from the stored line.
 */
export interface ResolvedCartItem extends CartItem {
  /** False when the product is gone from the catalog or cannot be purchased. */
  available: boolean;
}

/** Merge live catalog data into stored cart lines, keyed by slug. */
export function resolveCartItems(items: CartItem[], catalog: Product[]): ResolvedCartItem[] {
  // No catalog at all means we could not load it (e.g. a brief database
  // outage), not that every product vanished. Keep the stored snapshot rather
  // than telling the customer their whole cart is unavailable.
  if (catalog.length === 0) return items.map((item) => ({ ...item, available: true }));

  const bySlug = new Map(catalog.map((p) => [p.slug, p]));

  return items.map((item) => {
    const product = bySlug.get(item.slug);
    // Unknown slug: keep the snapshot so the row can still be removed.
    if (!product) return { ...item, available: false };

    return {
      ...item,
      // productId stays as stored — the cart store keys its actions on it.
      name: product.name,
      priceEur: product.priceEur,
      image: product.images[0] ?? undefined,
      scale: product.scale,
      available:
        product.status !== 'out_of_stock' && product.status !== 'in_development',
    };
  });
}

/** Order total in EUR for the lines that can actually be purchased. */
export function cartTotal(items: ResolvedCartItem[]): number {
  return items
    .filter((i) => i.available)
    .reduce((sum, i) => sum + i.priceEur * i.quantity, 0);
}
