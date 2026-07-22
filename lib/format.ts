/**
 * Formatting helpers.
 */

import type { Locale } from '@/types';
import { CURRENCY } from '@/constants';

/**
 * Round a monetary amount to 2 decimals.
 *
 * Prices are decimal euros, so sums and products can pick up binary
 * floating-point noise (e.g. 499.99 * 3 → 1499.9700000000003). Computed totals
 * go through this so stored and compared values stay exact to the cent.
 */
export function roundMoney(amount: number): number {
  return Math.round((amount + Number.EPSILON) * 100) / 100;
}

/**
 * Format a price in EUR into a localized currency string.
 *
 * @param amount Price in euros (e.g. 499.99).
 * @param locale UI locale controlling number/grouping format.
 * @returns e.g. "€499.99" (en) or "499,99 €" (ru, az).
 */
const INTL_LOCALES: Record<Locale, string> = {
  en: 'en-IE',
  ru: 'ru-RU',
  az: 'az-AZ',
};

export function formatPrice(amount: number, locale: Locale = 'en'): string {
  return new Intl.NumberFormat(INTL_LOCALES[locale] ?? INTL_LOCALES.en, {
    style: 'currency',
    currency: CURRENCY,
  }).format(amount);
}
