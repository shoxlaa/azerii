'use client';

import { ThemeProvider as NextThemesProvider } from 'next-themes';
import type { ReactNode } from 'react';

/**
 * App theme provider (next-themes).
 * - class strategy (adds `light` / `dark` on <html>)
 * - default follows the OS (prefers-color-scheme), user can override
 * - choice is persisted; no flash on load (script injected before paint)
 */
export function ThemeProvider({ children }: { children: ReactNode }) {
  return (
    <NextThemesProvider
      attribute="class"
      defaultTheme="system"
      enableSystem
      disableTransitionOnChange
    >
      {children}
    </NextThemesProvider>
  );
}
