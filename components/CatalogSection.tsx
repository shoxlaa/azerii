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

/** Homepage "Model catalog" preview — a grid of product cards. */
export function CatalogSection({ products }: CatalogSectionProps) {
  const { locale } = useLocale();
  const dict = getDictionary(locale);
  const t = dict.catalogSection;

  const items = products.slice(0, 8);

  return (
    <section className="py-16 md:py-20">
      <Container>
        <SectionTitle
          action={
            <Link
              href="/catalog"
              className="font-heading text-sm font-semibold uppercase tracking-wide text-gold transition-colors hover:text-gold-hover"
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
          <div className="mt-8 grid grid-cols-2 gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
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
