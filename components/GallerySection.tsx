'use client';

import Image from 'next/image';
import Link from 'next/link';
import type { Painting } from '@/types';
import { getDictionary } from '@/i18n';
import { useLocale } from '@/i18n/locale-context';
import { Container } from './ui/Container';
import { ScrollRow } from './ui/ScrollRow';
import { SectionTitle } from './ui/SectionTitle';

/**
 * Homepage gallery teaser — one scrolling row of canvases.
 *
 * Canvases have no page of their own, so every card leads to /gallery. The
 * subtitle carries the physical size, which is the fact buyers ask about first;
 * the price stays on /gallery, where the enquiry button sits next to it.
 */
export function GallerySection({ paintings }: { paintings: Painting[] }) {
  const { locale } = useLocale();
  const dict = getDictionary(locale);
  const t = dict.gallerySection;

  // Nothing to show yet: stay out of the page rather than show an empty strip.
  if (paintings.length === 0) return null;

  return (
    <section className="py-12 md:py-16">
      <Container>
        <SectionTitle
          action={
            <Link
              href="/gallery"
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
          {paintings.map((painting) => {
            const title = painting.title[locale] || painting.title.en;
            const image = painting.gridImage ?? painting.images[0];

            return (
              <Link
                key={painting.id}
                href="/gallery"
                data-testid="gallery-teaser-card"
                className="group w-[200px] shrink-0 sm:w-[220px]"
              >
                {/* Canvases vary in proportion: fixed slot, contained image, so
                    the work is never cropped. */}
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
                  {dict.paintings.fields.size}: {painting.size}
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
