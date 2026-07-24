'use client';

import Link from 'next/link';
import type { Product } from '@/types';
import { getDictionary } from '@/i18n';
import { useLocale } from '@/i18n/locale-context';
import { Container } from './ui/Container';
import { SectionTitle } from './ui/SectionTitle';
import { ProductCard } from './ProductCard';

interface CatalogSectionProps {
  products: Product[];
}

/** How many models the homepage teases before sending visitors to /catalog: two rows of five. */
const PREVIEW_COUNT = 10;

/** Homepage "Model catalog" preview — a grid of product cards. */
export function CatalogSection({ products }: CatalogSectionProps) {
  const { locale } = useLocale();
  const dict = getDictionary(locale);
  const t = dict.catalogSection;

  // Teaser shows the first models across every category and status; /catalog holds the full list.
  const items = products.slice(0, PREVIEW_COUNT);

  return (
    <section className="py-16 md:py-20">
      <Container>
        <SectionTitle
          action={
            <Link
              href="/catalog"
              className="font-heading text-sm font-semibold uppercase tracking-wide text-accent-text transition-colors hover:text-accent-text"
            >
              {t.viewAll} <span aria-hidden>→</span>
            </Link>
          }
        >
          {t.title}
        </SectionTitle>

        {items.length === 0 ? (
          <p className="mt-10 text-subtle">{t.empty}</p>
        ) : (
          <div className="mt-8 grid grid-cols-2 gap-5 md:grid-cols-3 xl:grid-cols-5">
            {items.map((product) => (
              <ProductCard
                key={product.id}
                product={product}
                locale={locale}
                statusLabel={dict.status[product.status]}
                scaleWord={t.scaleWord}
                addToCartLabel={dict.common.addToCart}
              />
            ))}
          </div>
        )}
      </Container>
    </section>
  );
}
