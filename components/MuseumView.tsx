'use client';

/**
 * MuseumView — a digital museum, not a shop section.
 *
 * Reads as a visit: a title wall, then a history ribbon of the machines we
 * rebuild, oldest first. The standing collection of finished exhibits follows
 * below.
 *
 * Nothing here carries a price or a buy button. Exhibits are not products,
 * and the timeline links to a model's page to read about it, not to buy it.
 */

import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { createPortal } from 'react-dom';
import type { MuseumCategory, MuseumItem, MuseumTimelineEntry } from '@/types';
import { MUSEUM_CATEGORIES } from '@/constants';
import { getDictionary } from '@/i18n';
import { useLocale } from '@/i18n/locale-context';
import { Container } from './ui/Container';
import { CloseIcon } from './icons';
import { MuseumTimeline, KICKER_CLASS } from './MuseumTimeline';

/** Horizontal travel (px) that counts as a swipe in the exhibit modal. */
const SWIPE_THRESHOLD = 50;

type Filter = MuseumCategory | 'all';

export interface MuseumViewProps {
  items: MuseumItem[];
  /** Products joined to their curated history note, oldest first. */
  timeline: MuseumTimelineEntry[];
}

export function MuseumView({ items, timeline }: MuseumViewProps) {
  return (
    <>
      <TitleWall />
      <MuseumTimeline entries={timeline} />
      <Collection items={items} />
    </>
  );
}

/**
 * Title wall — the plate by the door.
 *
 * Sized after `.text-h1` but set in `font-heading`: the display face is Latin
 * only, and this heading has to render in Russian too.
 */
function TitleWall() {
  const { locale } = useLocale();
  const t = getDictionary(locale).museum.intro;

  return (
    <section className="py-12 text-center md:py-16">
      <Container>
        <p className={KICKER_CLASS}>{t.kicker}</p>
        <h1 className="mt-5 font-heading text-[40px] font-bold uppercase leading-[0.95] tracking-[1px] text-heading md:text-[56px] lg:text-[72px] lg:tracking-[2px]">
          {t.title}
        </h1>
        <p className="mx-auto mt-5 max-w-2xl text-subtle">{t.lead}</p>
      </Container>
    </section>
  );
}

/** The standing collection: every finished exhibit, filterable by category. */
function Collection({ items }: { items: MuseumItem[] }) {
  const { locale } = useLocale();
  const dict = getDictionary(locale);
  const t = dict.museum;

  const [filter, setFilter] = useState<Filter>('all');
  const [openId, setOpenId] = useState<string | null>(null);

  const visible = useMemo(
    () => (filter === 'all' ? items : items.filter((i) => i.category === filter)),
    [items, filter],
  );

  // Only offer categories that actually have exhibits.
  const available = useMemo(
    () => MUSEUM_CATEGORIES.filter((c) => items.some((i) => i.category === c)),
    [items],
  );

  const open = items.find((i) => i.id === openId) ?? null;

  return (
    <section className="py-12 md:py-16">
      <Container>
        <h2 className="font-heading text-[28px] font-bold uppercase tracking-wide text-heading md:text-[40px]">
          {t.collection.title}
        </h2>
        <p className="mt-2 max-w-2xl text-subtle">{t.collection.lead}</p>

        {/* Category switcher — filters client-side, no navigation */}
        {items.length > 0 ? (
          <div className="mt-8 flex flex-wrap gap-2" role="tablist" aria-label={t.title}>
            <FilterChip
              label={t.all}
              active={filter === 'all'}
              onClick={() => setFilter('all')}
              count={items.length}
            />
            {available.map((c) => (
              <FilterChip
                key={c}
                label={t.categories[c]}
                active={filter === c}
                onClick={() => setFilter(c)}
                count={items.filter((i) => i.category === c).length}
              />
            ))}
          </div>
        ) : null}

        {/* Grid / empty states */}
        {items.length === 0 ? (
          <EmptyState title={t.emptyAll} hint={t.emptyAllHint} />
        ) : visible.length === 0 ? (
          <EmptyState title={t.empty} hint={t.emptyHint} />
        ) : (
          <div
            data-testid="museum-grid"
            className="mt-8 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3"
          >
            {visible.map((item) => (
              <ExhibitCard
                key={item.id}
                item={item}
                label={t.categories[item.category]}
                onOpen={() => setOpenId(item.id)}
              />
            ))}
          </div>
        )}
      </Container>

      {open ? (
        <ExhibitModal item={open} onClose={() => setOpenId(null)} dict={dict} />
      ) : null}
    </section>
  );
}

function FilterChip({
  label,
  active,
  onClick,
  count,
}: {
  label: string;
  active: boolean;
  onClick: () => void;
  count: number;
}) {
  return (
    <button
      type="button"
      role="tab"
      aria-selected={active}
      onClick={onClick}
      data-testid="museum-filter"
      className={`rounded-full border px-4 py-2 font-heading text-xs uppercase tracking-wide transition-colors ${
        active
          ? 'border-accent bg-accent text-cream'
          : 'border-border text-body hover:border-accent hover:text-accent-text'
      }`}
    >
      {label}
      <span className={active ? 'ml-1.5 text-cream/70' : 'ml-1.5 text-subtle'}>{count}</span>
    </button>
  );
}

function EmptyState({ title, hint }: { title: string; hint: string }) {
  return (
    <div className="mt-20 mb-10 text-center" data-testid="museum-empty">
      <p className="font-heading text-xl font-semibold uppercase tracking-wide text-heading">
        {title}
      </p>
      <p className="mt-2 text-subtle">{hint}</p>
    </div>
  );
}

/** Photo-forward card: the work itself is the point, text stays secondary. */
function ExhibitCard({
  item,
  label,
  onOpen,
}: {
  item: MuseumItem;
  label: string;
  onOpen: () => void;
}) {
  const { locale } = useLocale();
  const title = item.title[locale] || item.title.en;
  const photo = item.images[0];

  return (
    <button
      type="button"
      onClick={onOpen}
      data-testid="museum-card"
      className="group flex min-w-0 flex-col overflow-hidden rounded-md border border-border bg-panel text-left transition-colors hover:border-accent/60"
    >
      {/* Fixed 4:3 slot keeps the grid even; object-contain never crops the model. */}
      <span className="relative block aspect-[4/3] w-full overflow-hidden bg-bg">
        {photo ? (
          <Image
            src={photo}
            alt={title}
            fill
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 400px"
            className="object-contain p-2 transition-transform duration-300"
          />
        ) : null}
        {item.images.length > 1 ? (
          <span className="absolute right-2 top-2 rounded-full bg-black/60 px-2 py-0.5 font-heading text-[10px] uppercase tracking-wide text-cream">
            {item.images.length}
          </span>
        ) : null}
      </span>

      <span className="flex flex-1 flex-col p-4">
        <span className="font-heading text-base font-semibold uppercase leading-tight tracking-wide text-heading transition-colors group-hover:text-accent-text">
          {title}
        </span>
        <span className="mt-1 font-heading text-xs uppercase tracking-wide text-subtle">
          {label}
          {item.scale ? ` · ${item.scale}` : ''}
        </span>
      </span>
    </button>
  );
}

function ExhibitModal({
  item,
  onClose,
  dict,
}: {
  item: MuseumItem;
  onClose: () => void;
  dict: ReturnType<typeof getDictionary>;
}) {
  const { locale } = useLocale();
  const t = dict.museum;
  const title = item.title[locale] || item.title.en;
  const description = item.description[locale] || item.description.en;

  const [index, setIndex] = useState(0);
  const touchX = useRef<number | null>(null);
  const many = item.images.length > 1;

  const show = useCallback(
    (i: number) => setIndex(((i % item.images.length) + item.images.length) % item.images.length),
    [item.images.length],
  );
  const next = useCallback(() => show(index + 1), [show, index]);
  const prev = useCallback(() => show(index - 1), [show, index]);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
      else if (e.key === 'ArrowRight') next();
      else if (e.key === 'ArrowLeft') prev();
    };
    document.addEventListener('keydown', onKey);
    return () => document.removeEventListener('keydown', onKey);
  }, [onClose, next, prev]);

  // Lock page scroll while the exhibit is open.
  useEffect(() => {
    const previous = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = previous;
    };
  }, []);

  const onTouchEnd = (e: React.TouchEvent) => {
    if (touchX.current === null || !many) return;
    const dx = e.changedTouches[0].clientX - touchX.current;
    touchX.current = null;
    if (Math.abs(dx) < SWIPE_THRESHOLD) return;
    if (dx < 0) next();
    else prev();
  };

  return createPortal(
    <div
      role="dialog"
      aria-modal="true"
      aria-label={title}
      data-testid="museum-modal"
      onClick={onClose}
      className="fixed inset-0 z-[2000] flex items-start justify-center overflow-y-auto bg-black/90 p-4 backdrop-blur-sm sm:items-center sm:p-6"
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="relative w-full max-w-5xl overflow-hidden rounded-md border border-border bg-panel"
      >
        <button
          type="button"
          onClick={onClose}
          aria-label={t.close}
          data-testid="museum-modal-close"
          className="absolute right-3 top-3 z-10 flex h-10 w-10 items-center justify-center rounded-full border border-border bg-bg/80 text-body transition-colors hover:border-accent hover:text-accent-text"
        >
          <CloseIcon className="h-5 w-5" />
        </button>

        <div className="grid gap-0 md:grid-cols-[1.15fr_1fr]">
          {/* Photo */}
          <div
            className="relative aspect-[4/3] w-full bg-bg"
            onTouchStart={(e) => {
              touchX.current = e.changedTouches[0].clientX;
            }}
            onTouchEnd={onTouchEnd}
          >
            {item.images[index] ? (
              <Image
                key={item.images[index]}
                src={item.images[index]}
                alt={title}
                fill
                sizes="(max-width: 768px) 100vw, 60vw"
                className="object-contain p-3"
                data-testid="museum-modal-image"
              />
            ) : null}

            {many ? (
              <>
                <button
                  type="button"
                  onClick={prev}
                  aria-label={dict.gallery.prev}
                  data-testid="museum-prev"
                  className="absolute left-2 top-1/2 flex h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full border border-border bg-bg/80 text-xl leading-none text-body transition-colors hover:border-accent hover:text-accent-text"
                >
                  ‹
                </button>
                <button
                  type="button"
                  onClick={next}
                  aria-label={dict.gallery.next}
                  data-testid="museum-next"
                  className="absolute right-2 top-1/2 flex h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full border border-border bg-bg/80 text-xl leading-none text-body transition-colors hover:border-accent hover:text-accent-text"
                >
                  ›
                </button>
                <span className="absolute bottom-2 left-1/2 -translate-x-1/2 rounded-full bg-black/60 px-2.5 py-0.5 font-heading text-[11px] uppercase tracking-wide text-cream">
                  {index + 1} {dict.gallery.counter} {item.images.length}
                </span>
              </>
            ) : null}
          </div>

          {/* Info */}
          <div className="flex flex-col p-5 md:p-7">
            <p className="font-heading text-xs uppercase tracking-wide text-accent-text">
              {t.categories[item.category]}
            </p>
            <h2 className="mt-2 font-heading text-2xl font-bold uppercase leading-tight tracking-wide text-heading md:text-3xl">
              {title}
            </h2>

            {item.scale ? (
              <p className="mt-3 font-heading text-sm uppercase tracking-wide text-subtle">
                {t.scale}: {item.scale}
              </p>
            ) : null}

            {description ? (
              <p className="mt-5 whitespace-pre-line text-sm leading-relaxed text-body">
                {description}
              </p>
            ) : null}

            {/* Commercial link only when the kit is actually sold. */}
            {item.productSlug ? (
              <div className="mt-auto pt-8">
                <Link
                  href={`/catalog/${item.productSlug}`}
                  data-testid="museum-product-link"
                  className="inline-flex h-[52px] items-center justify-center gap-2 rounded-[4px] border border-accent px-6 font-heading text-sm font-semibold uppercase tracking-wide text-accent-text transition-colors hover:bg-accent hover:text-cream"
                >
                  {t.inCatalog} →
                </Link>
              </div>
            ) : null}
          </div>
        </div>
      </div>
    </div>,
    document.body,
  );
}
