'use client';

/**
 * MuseumView — the standing collection of finished exhibits.
 *
 * The story of the machines themselves moved to /history; what is left here is
 * the display case: every model our modellers have built, filterable by
 * category, each opening in a fullscreen modal.
 *
 * Exhibits are not products — no price, no cart. The only commercial touch is
 * an optional link to the catalog when we happen to sell the same kit.
 */

import { useEffect, useMemo, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { createPortal } from 'react-dom';
import type { MuseumCategory, MuseumItem } from '@/types';
import { MUSEUM_CATEGORIES } from '@/constants';
import { getDictionary } from '@/i18n';
import { useLocale } from '@/i18n/locale-context';
import { Container } from './ui/Container';
import { ProductGallery } from './ProductGallery';
import { CloseIcon } from './icons';

type Filter = MuseumCategory | 'all';

export function MuseumView({ items }: { items: MuseumItem[] }) {
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
        <h1 className="font-heading text-[40px] font-bold uppercase tracking-[1px] text-heading md:text-[56px]">
          {t.title}
        </h1>
        <p className="mt-2 max-w-2xl text-subtle">{t.lead}</p>

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

  // True while the gallery's fullscreen lightbox is on top of this dialog.
  const [fullscreen, setFullscreen] = useState(false);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      // The lightbox owns Escape (and the arrows) while it is open; closing
      // both on a single press would drop the visitor back to the grid.
      if (fullscreen) return;
      if (e.key === 'Escape') onClose();
    };
    document.addEventListener('keydown', onKey);
    return () => document.removeEventListener('keydown', onKey);
  }, [onClose, fullscreen]);

  // Lock page scroll while the exhibit is open.
  useEffect(() => {
    const previous = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = previous;
    };
  }, []);

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
        // No `overflow-hidden`: the gallery's hover-zoom panel deliberately
        // spills past the photo column, and clipping it here would slice the
        // magnified view in half.
        className="relative w-full max-w-5xl rounded-md border border-border bg-panel"
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
          {/* Photo — the same viewer the catalog uses: hover zoom, thumbnail
              strip and a fullscreen lightbox, instead of the bare arrows this
              modal carried before. */}
          {/* min-w-0: a grid item defaults to min-width:auto, so the gallery's
              thumbnail strip (7 × 140px, wider than the column) would push the
              column — and the whole dialog — past max-w-5xl instead of
              scrolling inside itself. */}
          <div className="min-w-0 p-5 md:p-7 md:pr-0">
            <ProductGallery
              images={item.images}
              alt={title}
              onFullscreenChange={setFullscreen}
            />
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
