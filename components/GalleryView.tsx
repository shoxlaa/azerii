'use client';

import Image from 'next/image';
import Link from 'next/link';
import type { Painting } from '@/types';
import { getDictionary } from '@/i18n';
import { useLocale } from '@/i18n/locale-context';
import { formatPrice } from '@/lib/format';
import { Container } from './ui/Container';

/**
 * GalleryView — the AZERII painting gallery.
 *
 * A showcase, not a shop: each canvas is a single physical piece, so there is
 * no cart. Every card states size / technique / material / price and sends the
 * buyer to the contact page to enquire.
 */
export function GalleryView({ paintings }: { paintings: Painting[] }) {
  const { locale } = useLocale();
  const dict = getDictionary(locale);
  const t = dict.paintings;

  return (
    <section className="py-12 md:py-16">
      <Container>
        <h1 className="font-heading text-[40px] font-bold uppercase tracking-[1px] text-heading md:text-[56px]">
          {t.title}
        </h1>
        <p className="mt-3 max-w-2xl text-subtle">{t.lead}</p>

        {paintings.length === 0 ? (
          <div className="mt-12 rounded-md border border-border bg-panel p-10 text-center">
            <p className="font-heading text-lg uppercase tracking-wide text-heading">
              {t.empty}
            </p>
            <p className="mt-2 text-sm text-subtle">{t.emptyHint}</p>
          </div>
        ) : (
          <ul className="mt-10 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {paintings.map((painting) => {
              const title = painting.title[locale] || painting.title.en;
              const image = painting.gridImage ?? painting.images[0];

              return (
                <li
                  key={painting.id}
                  className="group flex flex-col overflow-hidden rounded-md border border-border bg-panel transition-colors hover:border-accent/50"
                >
                  {/* Canvases vary in proportion, so the slot is fixed and the
                      image is contained — never cropped, which would misrepresent
                      the work. */}
                  <div className="relative aspect-[4/3] overflow-hidden bg-panel">
                    {image ? (
                      <Image
                        src={image}
                        alt={title}
                        fill
                        unoptimized
                        sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 380px"
                        className="object-contain p-2"
                      />
                    ) : (
                      <div className="flex h-full w-full items-center justify-center text-sm text-subtle">
                        {t.noImage}
                      </div>
                    )}
                  </div>

                  <div className="flex flex-1 flex-col p-5">
                    <h2 className="font-heading text-lg font-semibold uppercase tracking-wide text-heading">
                      {title}
                    </h2>

                    <dl className="mt-3 space-y-1.5 text-sm text-subtle">
                      <Spec label={t.fields.size} value={painting.size} />
                      <Spec
                        label={t.fields.workType}
                        value={dict.workType[painting.workType]}
                      />
                      <Spec
                        label={t.fields.material}
                        value={dict.paintingMaterial[painting.material]}
                      />
                    </dl>

                    <p className="mt-4 font-heading text-xl font-bold text-heading">
                      {formatPrice(painting.priceEur, locale)}
                    </p>

                    <Link
                      href="/contact"
                      className="mt-4 inline-flex items-center justify-center bg-accent px-5 py-2.5 font-heading text-sm font-semibold uppercase tracking-wide text-cream transition-colors hover:bg-accent-hover"
                    >
                      {t.enquire}
                    </Link>
                  </div>
                </li>
              );
            })}
          </ul>
        )}
      </Container>
    </section>
  );
}

function Spec({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex gap-2">
      <dt className="shrink-0">{label}:</dt>
      <dd className="text-body">{value}</dd>
    </div>
  );
}
