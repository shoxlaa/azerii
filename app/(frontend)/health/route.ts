import { NextResponse } from 'next/server';
import { getPayload } from 'payload';
import config from '@payload-config';

/**
 * GET /health — liveness probe for external monitoring.
 *
 * The storefront deliberately survives a brief database outage: listing pages
 * degrade to an empty catalog rather than failing. That keeps visitors out of
 * error pages, but it also means "the site returns 200" says nothing about
 * whether the database is reachable — twice now an outage was noticed by a
 * human rather than by monitoring.
 *
 * This endpoint reports the truth instead: 200 only when the database answers,
 * 503 otherwise, so an uptime check can alert on it.
 *
 * Deliberately does NOT go through getProductsSafe() — that swallows failures,
 * which is exactly what must stay visible here.
 */

// Never cache: a stale "ok" would defeat the point.
export const dynamic = 'force-dynamic';

/** Public endpoint: report enough to diagnose, nothing that aids an attacker. */
function safeReason(err: unknown): string {
  const message = err instanceof Error ? err.message : String(err);
  // Connection strings and credentials can appear in driver errors.
  return message.replace(/postgres(ql)?:\/\/\S+/gi, '[redacted]').slice(0, 200);
}

export async function GET() {
  const startedAt = Date.now();

  try {
    const payload = await getPayload({ config });
    // Cheapest query that still proves the connection works end to end.
    await payload.count({ collection: 'products' });

    return NextResponse.json(
      { status: 'ok', db: { ok: true, ms: Date.now() - startedAt } },
      { status: 200, headers: { 'Cache-Control': 'no-store' } },
    );
  } catch (err) {
    console.error('[health] database unreachable:', err);

    return NextResponse.json(
      {
        status: 'degraded',
        db: { ok: false, ms: Date.now() - startedAt, error: safeReason(err) },
      },
      { status: 503, headers: { 'Cache-Control': 'no-store' } },
    );
  }
}
