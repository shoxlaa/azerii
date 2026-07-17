/**
 * Proxy — locale handling & persistence.
 *
 * Next.js 16 renamed the `middleware` file convention to `proxy`.
 * On the first visit (no locale cookie yet) the site defaults to English
 * and the choice is persisted, so the language switcher's selection sticks
 * across reloads and later visits.
 */

import { NextResponse, type NextRequest } from 'next/server';
import { DEFAULT_LOCALE, LOCALE_COOKIE, isLocale } from '@/i18n/config';

/** One year — the locale preference is long-lived. */
const LOCALE_MAX_AGE = 60 * 60 * 24 * 365;

export function proxy(request: NextRequest) {
  const response = NextResponse.next();

  const current = request.cookies.get(LOCALE_COOKIE)?.value;
  // First visit, or a stale/invalid value: seed the default locale (English).
  if (!current || !isLocale(current)) {
    response.cookies.set(LOCALE_COOKIE, DEFAULT_LOCALE, {
      path: '/',
      maxAge: LOCALE_MAX_AGE,
      sameSite: 'lax',
    });
  }

  return response;
}

export const config = {
  // Run on everything except Next internals and static assets.
  matcher: ['/((?!_next|.*\\..*).*)'],
};
