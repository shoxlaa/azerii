/**
 * Formatting helpers.
 */

import type { Locale } from '@/types';
import { CURRENCY } from '@/constants';

/**
 * Format a price stored in EUR cents into a localized currency string.
 *
 * @param cents  Price in EUR cents (e.g. 4990).
 * @param locale UI locale controlling number/grouping format.
 * @returns e.g. "€49.90" (en) or "49,90 €" (ru).
 */
export function formatPrice(cents: number, locale: Locale = 'en'): string {
  const intlLocale = locale === 'ru' ? 'ru-RU' : 'en-IE';
  return new Intl.NumberFormat(intlLocale, {
    style: 'currency',
    currency: CURRENCY,
  }).format(cents / 100);
}
