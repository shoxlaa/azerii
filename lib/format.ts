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
 * Intl locale used for each UI locale's number formatting.
 *
 * `az` deliberately does NOT map to 'az-AZ'. Node and browser ICU disagree
 * about it — Node renders "1.500,00 €", browsers "€ 1,500.00" — so the price a
 * visitor saw depended on their browser, and the server-rendered HTML did not
 * match what the client produced on hydration. 'de-DE' yields the intended
 * Azerbaijani shape ("1.500,00 €": full stop for thousands, comma for the
 * decimal, symbol last) and, unlike 'az-AZ', renders identically in both.
 *
 * This is a formatting proxy, not a language: nothing German is shown to the
 * visitor. Do not "correct" it back to 'az-AZ' without re-checking that both
 * environments agree — that is the bug this avoids.
 */
const INTL_LOCALES: Record<Locale, string> = {
  en: 'en-IE',
  ru: 'ru-RU',
  az: 'de-DE',
};

/**
 * Format a price in EUR into a localized currency string.
 *
 * @param amount Price in euros (e.g. 499.99).
 * @param locale UI locale controlling number/grouping format.
 * @returns e.g. "€499.99" (en), "499,99 €" (ru) or "1.500,00 €" (az).
 */
export function formatPrice(amount: number, locale: Locale = 'en'): string {
  return new Intl.NumberFormat(INTL_LOCALES[locale] ?? INTL_LOCALES.en, {
    style: 'currency',
    currency: CURRENCY,
  }).format(amount);
}
