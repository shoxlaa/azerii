import { NextResponse, type NextRequest } from 'next/server';
import { cookies } from 'next/headers';
import { getPayload, type Payload } from 'payload';
import config from '@payload-config';

/**
 * POST /api/visit — record a visit and report the all-time total.
 *
 * A visit is counted once per browser per day: the `azerii_visit` cookie holds
 * the day already counted, so a repeat call within the same day records
 * nothing. Days roll over at midnight in Baku, not UTC, so the tally matches
 * the shop's own day.
 *
 * Storage stays per-day — that is the history the admin panel charts — and the
 * number handed to the footer is the sum of every day, so the counter reads
 * "visitors since launch" rather than "visitors today".
 */

export const dynamic = 'force-dynamic';

/** True when the request reached us over HTTPS (Vercel terminates TLS upstream). */
function isHttps(request: NextRequest): boolean {
  // `request.nextUrl` normalises to the deployment base and reports https even
  // on a local http server, so read the raw request URL instead.
  return (
    request.headers.get('x-forwarded-proto') === 'https' ||
    new URL(request.url).protocol === 'https:'
  );
}

const TIME_ZONE = 'Asia/Baku';
const VISIT_COOKIE = 'azerii_visit';

/** Today's date in Baku as YYYY-MM-DD (en-CA formats exactly that way). */
function todayInBaku(): string {
  return new Intl.DateTimeFormat('en-CA', {
    timeZone: TIME_ZONE,
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
  }).format(new Date());
}

/**
 * Instant of the next midnight in Baku, used as the cookie's expiry so it dies
 * exactly when the counted day ends.
 */
function endOfDayInBaku(): Date {
  const now = new Date();
  // Where "now" sits inside the Baku day, derived from the formatted local time.
  const parts = new Intl.DateTimeFormat('en-GB', {
    timeZone: TIME_ZONE,
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
    hour12: false,
  }).formatToParts(now);
  const get = (type: string) => Number(parts.find((p) => p.type === type)?.value ?? 0);

  const elapsedMs =
    ((get('hour') * 60 + get('minute')) * 60 + get('second')) * 1000;
  const dayMs = 24 * 60 * 60 * 1000;
  return new Date(now.getTime() + (dayMs - elapsedMs));
}

/**
 * Every visit ever recorded, summed across the per-day rows.
 *
 * Summed in the route rather than read from a running total, so the figure is
 * always derived from the rows themselves and cannot drift away from them. One
 * row per day keeps that cheap — a decade of traffic is a few thousand rows —
 * and only `count` is selected, so nothing else travels.
 */
async function totalVisits(payload: Payload): Promise<number> {
  const { docs } = await payload.find({
    collection: 'daily-visits',
    pagination: false,
    depth: 0,
    select: { count: true },
  });
  return docs.reduce((sum, doc) => sum + ((doc as { count?: number }).count ?? 0), 0);
}

export async function POST(request: NextRequest) {
  try {
    const today = todayInBaku();
    const jar = await cookies();
    const alreadyCounted = jar.get(VISIT_COOKIE)?.value === today;

    const payload = await getPayload({ config });
    const { docs } = await payload.find({
      collection: 'daily-visits',
      where: { date: { equals: today } },
      limit: 1,
      depth: 0,
    });
    const existing = docs[0] as { id: string | number; count?: number } | undefined;

    // Seen today already — report the running total without counting again.
    if (alreadyCounted) {
      return NextResponse.json({ count: await totalVisits(payload) });
    }

    if (existing) {
      await payload.update({
        collection: 'daily-visits',
        id: existing.id as string,
        data: { count: (existing.count ?? 0) + 1 },
      });
    } else {
      await payload.create({ collection: 'daily-visits', data: { date: today, count: 1 } });
    }

    // Summed after the write, so the visitor sees themselves included.
    const response = NextResponse.json({ count: await totalVisits(payload) });
    response.cookies.set(VISIT_COOKIE, today, {
      httpOnly: true,
      sameSite: 'lax',
      // Only over HTTPS in production; local development runs on plain http,
      // where a Secure cookie would simply never be stored.
      secure: isHttps(request),
      path: '/',
      expires: endOfDayInBaku(),
    });
    return response;
  } catch (err) {
    console.error('[visit] failed to record visit:', err);
    // The counter is decorative — never let it break a page.
    return NextResponse.json({ error: 'unavailable' }, { status: 503 });
  }
}
