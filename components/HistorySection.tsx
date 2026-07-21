'use client';

import Image from 'next/image';
import Link from 'next/link';
import { getDictionary } from '@/i18n';
import { useLocale } from '@/i18n/locale-context';
import { Container } from './ui/Container';

/**
 * Wide banner art (21:9). The render is already desaturated, but `grayscale`
 * keeps it neutral in both themes regardless of which file is dropped in.
 */
const HISTORY_IMAGE = '/hero/history-ruins-wide.jpg';

export function HistorySection() {
  const { locale } = useLocale();
  const t = getDictionary(locale).history;

  return (
    <section className="py-12 md:py-16">
      <Container>
        <div className="relative overflow-hidden rounded-md border border-border bg-panel">
          {/* Art: covers the card on mobile (copy sits on top), right two thirds on desktop */}
          <div className="absolute inset-0 md:left-auto md:right-0 md:w-2/3">
            <Image
              src={HISTORY_IMAGE}
              alt=""
              fill
              sizes="(max-width: 768px) 100vw, 800px"
              className="object-cover object-center grayscale"
            />
            {/* Scrim: vertical on mobile, horizontal fade into the panel on desktop */}
            <div className="absolute inset-0 bg-gradient-to-t from-panel via-panel/85 to-panel/40 md:hidden" />
            <div className="absolute inset-0 hidden bg-gradient-to-r from-panel via-panel/70 to-transparent md:block" />
          </div>

          <div className="relative flex min-w-0 flex-col justify-center p-6 sm:p-10 md:min-h-[420px] md:w-1/2 md:p-14">
            <p className="font-heading text-xs font-semibold uppercase tracking-[2px] text-accent-text">
              {t.eyebrow}
            </p>

            <h2 className="mt-4 font-heading text-[28px] font-bold uppercase leading-tight tracking-[1px] text-heading sm:text-[34px] md:text-[40px]">
              {t.title}
            </h2>

            <p className="mt-5 max-w-md text-sm leading-relaxed text-body sm:text-base">
              {t.text}
            </p>

            <Link
              href="/museum"
              className="group mt-8 inline-flex w-fit items-center gap-3 border-b border-accent/50 pb-2 font-heading text-sm font-semibold uppercase tracking-wide text-accent-text transition-colors hover:border-accent"
            >
              {t.cta}
              <span aria-hidden className="transition-transform group-hover:translate-x-1">
                →
              </span>
            </Link>
          </div>
        </div>
      </Container>
    </section>
  );
}
