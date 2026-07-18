'use client';

import Link from 'next/link';
import { getDictionary } from '@/i18n';
import { useLocale } from '@/i18n/locale-context';
import { Container } from './ui/Container';

/** /checkout/success — order confirmation ("thank you") screen. */
export function OrderSuccess({ orderId }: { orderId: string }) {
  const { locale } = useLocale();
  const dict = getDictionary(locale);
  const t = dict.orderSuccess;

  return (
    <section className="py-16 md:py-24">
      <Container>
        <div className="mx-auto max-w-xl text-center" data-testid="order-success">
          <span className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-accent text-3xl text-cream">
            ✓
          </span>
          <h1 className="mt-6 font-heading text-[32px] font-bold uppercase leading-tight tracking-[1px] text-heading md:text-[44px]">
            {t.title}
          </h1>
          <p className="mt-4 text-base leading-relaxed text-body">{t.text}</p>

          {orderId ? (
            <p className="mt-6 inline-block rounded-[4px] border border-border bg-panel px-5 py-3">
              <span className="font-heading text-xs font-semibold uppercase tracking-wide text-subtle">
                {t.orderNumber}
              </span>
              <br />
              <span
                data-testid="order-id"
                className="font-heading text-lg font-semibold tracking-wide text-accent-text"
              >
                {orderId}
              </span>
            </p>
          ) : null}

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
