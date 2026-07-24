'use client';

/**
 * MuseumTimeline — the history ribbon.
 *
 * A single rule runs down the whole strip, painted twice: a static track in
 * `border` and an accent overlay whose height follows how far the reader has
 * scrolled. Each block hangs off that rule with a marker that fills in once
 * the block has been seen.
 *
 * The rule sits outside the Container so it can land on the true page centre
 * on desktop and ~12px from the viewport edge on mobile; the blocks put their
 * own content back inside a Container.
 *
 * Fill progress is read from a scroll listener rather than an
 * IntersectionObserver because it is a continuous value, not a threshold. The
 * measurement is throttled to one per animation frame.
 */

import { useEffect, useRef, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import type { MuseumTimelineEntry } from '@/types';
import { getDictionary } from '@/i18n';
import { useLocale } from '@/i18n/locale-context';
import { useReducedMotion } from '@/hooks/useReducedMotion';
import { useReveal, revealClass } from '@/hooks/useReveal';
import { Container } from './ui/Container';

/**
 * Fraction of the viewport height at which the fill head sits. 0.6 puts it a
 * little below the middle, so a block is "reached" just as it becomes
 * comfortable to read.
 */
const HEAD = 0.6;

/** Shared eyebrow styling for the page kicker and each block's "HISTORY". */
export const KICKER_CLASS =
  'font-heading text-xs uppercase tracking-[0.35em] text-accent-text';

export function MuseumTimeline({ entries }: { entries: MuseumTimelineEntry[] }) {
  const trackRef = useRef<HTMLDivElement>(null);
  const [scrolled, setScrolled] = useState(0);
  const reduced = useReducedMotion();

  // Readers who prefer reduced motion get the finished line, undrawn.
  const progress = reduced ? 1 : scrolled;

  useEffect(() => {
    const node = trackRef.current;
    if (!node || reduced) return;

    let frame = 0;
    const measure = () => {
      frame = 0;
      const rect = node.getBoundingClientRect();
      if (rect.height === 0) return;
      const raw = (window.innerHeight * HEAD - rect.top) / rect.height;
      setScrolled(Math.min(1, Math.max(0, raw)));
    };
    const onScroll = () => {
      if (frame) return;
      frame = window.requestAnimationFrame(measure);
    };

    // The first measurement is deferred to the next frame rather than run
    // inline, so the effect never writes state synchronously during commit.
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', onScroll);
    return () => {
      if (frame) window.cancelAnimationFrame(frame);
      window.removeEventListener('scroll', onScroll);
      window.removeEventListener('resize', onScroll);
    };
  }, [reduced]);

  if (entries.length === 0) return null;

  return (
    <div ref={trackRef} className="relative" data-testid="museum-timeline">
      {/* Unfilled track */}
      <span
        aria-hidden
        className="absolute bottom-0 left-3 top-0 w-0.5 -translate-x-1/2 bg-border md:left-1/2"
      />
      {/* Accent fill, drawn as the reader descends */}
      <span
        aria-hidden
        data-testid="timeline-fill"
        className="absolute left-3 top-0 w-0.5 -translate-x-1/2 bg-accent md:left-1/2"
        style={{ height: `${progress * 100}%` }}
      />

      {entries.map((entry, i) => (
        // Even blocks read text-left / photo-right; odd blocks mirror.
        <HistoryBlock key={entry.slug} entry={entry} flipped={i % 2 === 1} />
      ))}
    </div>
  );
}

function HistoryBlock({ entry, flipped }: { entry: MuseumTimelineEntry; flipped: boolean }) {
  const { locale } = useLocale();
  const t = getDictionary(locale).historyPage;
  const { ref, revealed } = useReveal<HTMLDivElement>();

  const name = entry.name[locale] || entry.name.en;

  // Written out in full rather than composed, so Tailwind can see both classes.
  const textOrder = flipped ? 'md:order-2' : 'md:order-1';
  const photoOrder = flipped ? 'md:order-1' : 'md:order-2';

  const specs: { label: string; value: string }[] = [
    { label: t.block.crew, value: entry.crew },
    { label: t.block.armor, value: entry.armor },
    { label: t.block.engine, value: entry.engine },
    { label: t.block.weight, value: entry.weight },
  ];

  return (
    <div ref={ref} className="relative" data-testid="history-block">
      {/*
        Marker. Sits level with the year on both layouts: vertically centred on
        desktop, and pinned to the year's own row on mobile, where the block is
        a single column and the year is near the top.
      */}
      <span
        aria-hidden
        data-testid="timeline-dot"
        className={`absolute left-3 top-[116px] z-10 h-4 w-4 -translate-x-1/2 rounded-full border-2 border-accent-text transition-colors duration-500 motion-reduce:transition-none md:left-1/2 md:top-1/2 md:h-5 md:w-5 md:-translate-y-1/2 ${
          revealed ? 'bg-accent-text' : 'bg-bg'
        }`}
      />

      <Container>
        <div
          className={`grid grid-cols-1 items-center gap-8 py-12 pl-6 md:grid-cols-2 md:gap-24 md:py-16 md:pl-0 ${revealClass(revealed)}`}
        >
          {/* Text column */}
          <div className={`min-w-0 ${textOrder}`}>
            <p className={KICKER_CLASS}>{t.block.kicker}</p>

            {/* Digits only — safe for the Latin-only display face. */}
            <p className="mt-3 font-display text-[96px] font-bold leading-none text-accent-text md:text-[120px]">
              {entry.year}
            </p>

            <p className="mt-3 font-heading text-lg font-semibold uppercase tracking-wide text-heading md:text-xl">
              {entry.country} · {name}
            </p>

            <dl className="mt-8">
              {specs.map((spec) => (
                <div
                  key={spec.label}
                  className="flex items-baseline justify-between gap-4 border-b border-border py-3"
                >
                  <dt className="min-w-0 font-heading text-xs uppercase tracking-wide text-subtle md:text-sm">
                    {spec.label}
                  </dt>
                  <dd className="min-w-0 font-heading text-sm uppercase tracking-wide text-heading md:text-base">
                    {spec.value}
                  </dd>
                </div>
              ))}
            </dl>

            <Link
              href={`/catalog/${entry.slug}`}
              data-testid="history-link"
              className="mt-8 inline-flex h-[52px] items-center justify-center rounded-[4px] border border-border px-6 font-heading text-sm font-semibold uppercase tracking-wide text-body transition-colors hover:border-accent hover:text-accent-text"
            >
              {t.block.readHistory}
            </Link>
          </div>

          {/* Photo column — never cropped, never scaled on hover. */}
          <div className={`min-w-0 ${photoOrder}`}>
            <div className="relative aspect-[4/3] w-full overflow-hidden rounded-md border border-border bg-panel">
              {entry.image ? (
                <Image
                  src={entry.image}
                  alt={name}
                  fill
                  unoptimized
                  sizes="(max-width: 768px) 100vw, 45vw"
                  className="object-contain p-3"
                />
              ) : null}
            </div>
          </div>
        </div>
      </Container>
    </div>
  );
}
