/**
 * Proxy — locale handling & redirects.
 *
 * Next.js 16 renamed the `middleware` file convention to `proxy`.
 * Placeholder stub: currently a pass-through. Locale detection and
 * `/en` ⇄ `/ru` redirects will be implemented here later.
 */

import { NextResponse } from 'next/server';

export function proxy() {
  // TODO: detect locale from cookie / Accept-Language and redirect.
  return NextResponse.next();
}

export const config = {
  // Run on everything except Next internals and static assets.
  matcher: ['/((?!_next|.*\\..*).*)'],
};
