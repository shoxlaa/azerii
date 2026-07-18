'use client';

import Link from 'next/link';
import { getDictionary } from '@/i18n';
import { useLocale } from '@/i18n/locale-context';
import { Container } from './ui/Container';
import { FeaturesRow } from './FeaturesRow';

/** /about — who AZERII is. */
export function AboutView() {
  const { locale } = useLocale();
  const dict = getDictionary(locale);
  const t = dict.aboutPage;

  return (
    <section className="py-12 md:py-16">
      <Container>
        <h1 className="font-heading text-[40px] font-bold uppercase tracking-[1px] text-heading md:text-[56px]">
          {t.title}
        </h1>
        <p className="mt-4 max-w-2xl font-heading text-lg uppercase tracking-wide text-accent-text">
          {t.lead}
        </p>
        <p className="mt-5 max-w-2xl leading-relaxed text-body">{t.body}</p>

        <div className="mt-8 flex flex-col gap-3 sm:flex-row">
          <Link
            href="/catalog"
            className="inline-flex h-[52px] items-center justify-center rounded-[4px] bg-accent px-6 font-heading text-sm font-semibold uppercase tracking-wide text-cream transition-colors hover:bg-accent-hover"
          >
            {t.catalogCta}
          </Link>
          <Link
            href="/contact"
            className="inline-flex h-[52px] items-center justify-center rounded-[4px] border border-border px-6 font-heading text-sm font-semibold uppercase tracking-wide text-body transition-colors hover:border-accent hover:text-accent-text"
          >
            {t.contactCta}
          </Link>
        </div>
      </Container>

      <div className="mt-4">
        <FeaturesRow />
      </div>
    </section>
  );
}
