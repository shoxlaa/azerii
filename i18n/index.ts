/**
 * i18n entry point: dictionary loader.
 *
 * `getDictionary` returns the translation object for a locale, falling
 * back to the default locale for unknown values.
 */

import type { Locale } from '@/types';
import { DEFAULT_LOCALE, isLocale } from './config';
import en from './dictionaries/en';
import ru from './dictionaries/ru';

/** Shape of a translation dictionary (derived from the EN dictionary). */
export type Dictionary = typeof en;

const dictionaries: Record<Locale, Dictionary> = { en, ru };

/** Get the dictionary for a locale (falls back to the default locale). */
export function getDictionary(locale: string): Dictionary {
  const key: Locale = isLocale(locale) ? locale : DEFAULT_LOCALE;
  return dictionaries[key];
}

export { DEFAULT_LOCALE, LOCALES, LOCALE_LABELS, isLocale } from './config';
