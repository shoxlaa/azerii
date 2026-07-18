'use client';

import Link from 'next/link';
import { getDictionary } from '@/i18n';
import { useLocale } from '@/i18n/locale-context';
import { Container } from './ui/Container';

/** Shared 404 body — rendered inside the storefront layout (header + footer). */
export function NotFoundView() {
  const { locale } = useLocale();
  const t = getDictionary(locale).notFound;

  return (
    <section className="py-20 md:py-28">
      <Container>
        <div className="mx-auto max-w-xl text-center" data-testid="not-found">
          <p className="font-display text-[72px] font-bold leading-none tracking-[2px] text-accent-text md:text-[96px]">
            {t.code}
          </p>
          <h1 className="mt-4 font-heading text-[28px] font-bold uppercase tracking-wide text-heading md:text-[36px]">
            {t.title}
          </h1>
          <p className="mt-4 leading-relaxed text-subtle">{t.text}</p>

          <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row">
            <Link
              href="/catalog"
              className="inline-flex h-[52px] items-center justify-center rounded-[4px] bg-accent px-6 font-heading text-sm font-semibold uppercase tracking-wide text-cream transition-colors hover:bg-accent-hover"
            >
              {t.browseCatalog}
            </Link>
            <Link
              href="/"
              className="inline-flex h-[52px] items-center justify-center rounded-[4px] border border-border px-6 font-heading text-sm font-semibold uppercase tracking-wide text-body transition-colors hover:border-accent hover:text-accent-text"
            >
              {t.backHome}
            </Link>
          </div>
        </div>
      </Container>
    </section>
  );
}
