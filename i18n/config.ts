/**
 * i18n configuration: supported locales and helpers.
 */

import type { Locale } from '@/types';

/** All locales the app supports, in switcher order. */
export const LOCALES: Locale[] = ['en', 'ru', 'az'];

/** Locale used when none is specified / detected. */
export const DEFAULT_LOCALE: Locale = 'en';

/**
 * Cookie that persists the visitor's chosen locale across visits. The proxy
 * seeds it with DEFAULT_LOCALE on first visit and the language switcher
 * updates it, so the choice survives reloads and new sessions.
 */
export const LOCALE_COOKIE = 'NEXT_LOCALE';

/** Human-readable label for each locale (for the language switcher). */
export const LOCALE_LABELS: Record<Locale, string> = {
  en: 'English',
  ru: 'Русский',
  az: 'Azərbaycanca',
};

/** Two-letter code shown in the compact header switcher. */
export const LOCALE_SHORT: Record<Locale, string> = {
  en: 'EN',
  ru: 'RU',
  az: 'AZ',
};

/** Type guard: is the given string one of our supported locales? */
export function isLocale(value: string): value is Locale {
  return (LOCALES as string[]).includes(value);
}
