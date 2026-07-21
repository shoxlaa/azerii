'use client';

/**
 * LocaleProvider — single client-side source of truth for the active UI
 * locale. Header, Footer and any other component read/switch the locale
 * through `useLocale()`, so switching EN/RU re-renders them together.
 */

import { createContext, useCallback, useContext, useState, type ReactNode } from 'react';
import type { Locale } from '@/types';
import { DEFAULT_LOCALE, LOCALE_COOKIE } from './config';

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

  const setLocale = useCallback((next: Locale) => {
    setLocaleState(next);
    // Persist the choice so it survives reloads and future visits.
    // `secure` only on https — on a plain-http localhost the browser would
    // silently drop the cookie.
    const secure = window.location.protocol === 'https:' ? '; secure' : '';
    document.cookie = `${LOCALE_COOKIE}=${next}; path=/; max-age=${LOCALE_MAX_AGE}; samesite=lax${secure}`;
  }, []);

  const toggleLocale = useCallback(() => {
    setLocale(locale === 'ru' ? 'en' : 'ru');
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
