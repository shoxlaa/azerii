'use client';

import { useEffect, useState } from 'react';
import { getDictionary } from '@/i18n';
import { useLocale } from '@/i18n/locale-context';

/**
 * VisitCounter — "visitors today", counted once per browser per day.
 *
 * Renders nothing until the number arrives, and nothing at all if the request
 * fails, so the footer never reserves space for a value that may not come and
 * a counter outage stays invisible to the visitor.
 */
export function VisitCounter() {
  const { locale } = useLocale();
  const t = getDictionary(locale).visitCounter;
  const [count, setCount] = useState<number | null>(null);

  useEffect(() => {
    // Guards against the double-invoke of React strict mode.
    let cancelled = false;

    fetch('/api/visit', { method: 'POST' })
      .then((res) => (res.ok ? res.json() : null))
      .then((data: { count?: number } | null) => {
        if (!cancelled && typeof data?.count === 'number') setCount(data.count);
      })
      .catch(() => {
        /* decorative — stay hidden on failure */
      });

    return () => {
      cancelled = true;
    };
  }, []);

  if (count === null) return null;

  return (
    <p
      data-testid="visit-counter"
      className="font-heading text-xs uppercase tracking-wide text-subtle"
    >
      {t.label}: <span className="text-accent-text">{count}</span>
    </p>
  );
}
