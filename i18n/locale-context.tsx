'use client';

/**
 * LocaleProvider — single client-side source of truth for the active UI
 * locale. Header, Footer and any other component read/switch the locale
 * through `useLocale()`, so switching EN/RU re-renders them together.
 */

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from 'react';
import type { Locale } from '@/types';
import { DEFAULT_LOCALE, LOCALE_COOKIE, LOCALES } from './config';

/** One year — matches the proxy so the preference is long-lived. */
const LOCALE_MAX_AGE = 60 * 60 * 24 * 365;

interface LocaleContextValue {
  locale: Locale;
  setLocale: (locale: Locale) => void;
  toggleLocale: () => void;
}

const LocaleContext = createContext<LocaleContextValue | null>(null);

export function LocaleProvider({
  children,
  initialLocale = DEFAULT_LOCALE,
}: {
  children: ReactNode;
  initialLocale?: Locale;
}) {
  const [locale, setLocaleState] = useState<Locale>(initialLocale);

  /**
   * Keep <html lang> in step with the switcher.
   *
   * The server sets the attribute once from the cookie, but switching locale
   * never reloads the page, so without this the tag keeps the language the
   * visitor arrived in. That is not cosmetic: `text-transform: uppercase` is
   * locale-sensitive, and under lang="az" a browser uppercases `i` to `İ` per
   * the Turkish/Azerbaijani casing rules. English text left under a stale
   * lang="az" therefore renders AZERİİ in every uppercased heading, button and
   * nav item — which is most of the site.
   */
  useEffect(() => {
    document.documentElement.lang = locale;
  }, [locale]);

  const setLocale = useCallback((next: Locale) => {
    setLocaleState(next);
    // Persist the choice so it survives reloads and future visits.
    // `secure` only on https — on a plain-http localhost the browser would
    // silently drop the cookie.
    const secure = window.location.protocol === 'https:' ? '; secure' : '';
    document.cookie = `${LOCALE_COOKIE}=${next}; path=/; max-age=${LOCALE_MAX_AGE}; samesite=lax${secure}`;
  }, []);

  /**
   * Step to the next locale in LOCALES order, wrapping at the end. Written as
   * a cycle rather than a two-way flip so adding a locale to LOCALES is the
   * only change a new language needs here.
   */
  const toggleLocale = useCallback(() => {
    const i = LOCALES.indexOf(locale);
    setLocale(LOCALES[(i + 1) % LOCALES.length]);
  }, [locale, setLocale]);

  return (
    <LocaleContext.Provider value={{ locale, setLocale, toggleLocale }}>
      {children}
    </LocaleContext.Provider>
  );
}

/** Read the active locale and switchers. Must be used within LocaleProvider. */
export function useLocale(): LocaleContextValue {
  const ctx = useContext(LocaleContext);
  if (!ctx) {
    throw new Error('useLocale must be used within a LocaleProvider');
  }
  return ctx;
}
