/**
 * Product search.
 *
 * Matches a free-text query against a product's name (EN & RU) and its
 * type/category label (EN & RU). Case-insensitive; every whitespace-separated
 * token must match (AND), so "t 26" still finds "T-26". Empty query → no
 * results. Input order is preserved.
 */

import type { Product } from '@/types';
import en from '@/i18n/dictionaries/en';
import ru from '@/i18n/dictionaries/ru';

/** Lowercase + collapse whitespace for locale-insensitive comparison. */
function norm(value: string): string {
  return value.toLowerCase().replace(/\s+/g, ' ').trim();
}

/** Searchable text for a product: name + type label, in both locales. */
function haystack(product: Product): string {
  return norm(
    [
      product.name.en,
      product.name.ru,
      en.category[product.category],
      ru.category[product.category],
    ].join(' '),
  );
}

/** Return the products matching `query`. */
export function searchProducts(products: Product[], query: string): Product[] {
  const q = norm(query);
  if (!q) return [];
  const tokens = q.split(' ');
  return products.filter((p) => {
    const hay = haystack(p);
    return tokens.every((t) => hay.includes(t));
  });
}
