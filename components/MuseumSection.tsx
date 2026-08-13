'use client';

import Image from 'next/image';
import Link from 'next/link';
import type { MuseumItem } from '@/types';
import { getDictionary } from '@/i18n';
import { useLocale } from '@/i18n/locale-context';
import { Container } from './ui/Container';
import { ScrollRow } from './ui/ScrollRow';
import { SectionTitle } from './ui/SectionTitle';

/**
 * Homepage museum teaser — one scrolling row of exhibit photographs.
 *
 * Exhibits have no page of their own (the museum opens them in a modal), so
 * every card leads to /museum, same as the heading's action.
 */
export function MuseumSection({ items }: { items: MuseumItem[] }) {
  const { locale } = useLocale();
  const dict = getDictionary(locale);
  const t = dict.museumSection;

  // Nothing curated yet: stay out of the page rather than show an empty strip.
  if (items.length === 0) return null;

  return (
    <section className="py-12 md:py-16">
      <Container>
        <SectionTitle
          action={
            <Link
              href="/museum"
              className="font-heading text-sm font-semibold uppercase tracking-wide text-accent-text transition-colors hover:text-accent-text"
            >
              {t.viewAll} <span aria-hidden>→</span>
            </Link>
          }
        >
          {t.title}
        </SectionTitle>
      </Container>

      <Container className="mt-8">
        <ScrollRow>
          {items.map((item) => {
            const title = item.title[locale] || item.title.en;
            const image = item.gridImage ?? item.images[0];

            return (
              <Link
                key={item.id}
                href="/museum"
                data-testid="museum-teaser-card"
                className="group w-[200px] shrink-0 sm:w-[220px]"
              >
                {/* Models are never cropped, so the slot is fixed and the photo
                    is contained; only the border reacts to hover. */}
                <div className="relative aspect-[4/3] overflow-hidden rounded-md border border-border bg-panel transition-colors group-hover:border-accent/50">
                  {image ? (
                    <Image
                      src={image}
                      alt={title}
                      fill
                      unoptimized
                      sizes="220px"
                      className="object-contain p-2"
                    />
                  ) : (
                    <div className="flex h-full w-full items-center justify-center px-2 text-center text-xs text-subtle">
                      {dict.paintings.noImage}
                    </div>
                  )}
                </div>

                <p className="mt-2.5 font-heading text-xs uppercase tracking-wide text-subtle">
                  {dict.museum.categories[item.category]}
                </p>
                <p className="mt-1 line-clamp-2 font-heading text-sm font-semibold uppercase tracking-wide leading-snug text-heading transition-colors group-hover:text-accent-text">
                  {title}
                </p>
              </Link>
            );
          })}
        </ScrollRow>
      </Container>
    </section>
  );
}
