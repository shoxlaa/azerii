'use client';

import Link from 'next/link';
import { getDictionary } from '@/i18n';
import { useLocale } from '@/i18n/locale-context';
import { Container } from './ui/Container';

/**
 * Shown when a page fails to render — in practice, when the database is
 * briefly unreachable. Offers a retry, because these failures are transient.
 */
export function ErrorView({ reset }: { reset: () => void }) {
  const { locale } = useLocale();
  const t = getDictionary(locale).errorPage;

  return (
    <section className="py-20 md:py-28">
      <Container>
        <div className="mx-auto max-w-xl text-center" data-testid="error-view">
          <h1 className="font-heading text-[28px] font-bold uppercase tracking-wide text-heading md:text-[36px]">
            {t.title}
          </h1>
          <p className="mt-4 leading-relaxed text-subtle">{t.text}</p>

          <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row">
            <button
              type="button"
              onClick={reset}
              data-testid="error-retry"
              className="inline-flex h-[52px] items-center justify-center rounded-[4px] bg-accent px-6 font-heading text-sm font-semibold uppercase tracking-wide text-cream transition-colors hover:bg-accent-hover"
            >
              {t.retry}
            </button>
            <Link
              href="/catalog"
              className="inline-flex h-[52px] items-center justify-center rounded-[4px] border border-border px-6 font-heading text-sm font-semibold uppercase tracking-wide text-body transition-colors hover:border-accent hover:text-accent-text"
            >
              {t.browseCatalog}
            </Link>
          </div>
        </div>
      </Container>
    </section>
  );
}
