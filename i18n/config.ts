/**
 * i18n configuration: supported locales and helpers.
 */

import type { Locale } from '@/types';

/** All locales the app supports. */
export const LOCALES: Locale[] = ['en', 'ru'];

/** Locale used when none is specified / detected. */
export const DEFAULT_LOCALE: Locale = 'en';

/** Human-readable label for each locale (for the language switcher). */
export const LOCALE_LABELS: Record<Locale, string> = {
  en: 'English',
  ru: 'Русский',
};

/** Type guard: is the given string one of our supported locales? */
export function isLocale(value: string): value is Locale {
  return (LOCALES as string[]).includes(value);
}
