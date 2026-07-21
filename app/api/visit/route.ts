import { NextResponse, type NextRequest } from 'next/server';
import { cookies } from 'next/headers';
import { getPayload } from 'payload';
import config from '@payload-config';

/**
 * POST /api/visit — count one visitor per day.
 *
 * A visit is counted once per browser per day: the `azerii_visit` cookie holds
 * the day already counted, so a repeat call within the same day just reports
 * the current total. Days roll over at midnight in Baku, not UTC, so the
 * counter matches the shop's own day.
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

    // Seen today already — report the total without counting again.
    if (alreadyCounted) {
      return NextResponse.json({ count: existing?.count ?? 0 });
    }

    let count: number;
    if (existing) {
      count = (existing.count ?? 0) + 1;
      await payload.update({
        collection: 'daily-visits',
        id: existing.id as string,
        data: { count },
      });
    } else {
      count = 1;
      await payload.create({ collection: 'daily-visits', data: { date: today, count } });
    }

    const response = NextResponse.json({ count });
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
