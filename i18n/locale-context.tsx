'use client';

/**
 * LocaleProvider — single client-side source of truth for the active UI
 * locale. Header, Footer and any other component read/switch the locale
 * through `useLocale()`, so switching EN/RU re-renders them together.
 */

import { createContext, useContext, useState, type ReactNode } from 'react';
import type { Locale } from '@/types';
import { DEFAULT_LOCALE } from './config';

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
  const [locale, setLocale] = useState<Locale>(initialLocale);
  const toggleLocale = () => setLocale((l) => (l === 'ru' ? 'en' : 'ru'));

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
