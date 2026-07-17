'use client';

import Link from 'next/link';
import type { Product } from '@/types';
import { getDictionary } from '@/i18n';
import { useLocale } from '@/i18n/locale-context';
import { Container } from './ui/Container';
import { ProductCard } from './ProductCard';
import { SearchIcon } from './icons';

/** Full-page search results for /search?q=… */
export function SearchView({ query, results }: { query: string; results: Product[] }) {
  const { locale } = useLocale();
  const dict = getDictionary(locale);
  const t = dict.searchPage;

  return (
    <section className="py-12 md:py-16">
      <Container>
        <h1 className="font-heading text-[40px] font-bold uppercase tracking-[1px] text-heading md:text-[56px]">
          {t.title}
        </h1>

        {query ? (
          <p className="mt-1 text-subtle">
            {results.length} {t.found} «{query}»
          </p>
        ) : (
          <p className="mt-1 text-subtle">{t.prompt}</p>
        )}

        {/* No query yet */}
        {!query ? (
          <div className="mt-20 mb-10 text-center text-subtle">
            <SearchIcon className="mx-auto h-10 w-10 opacity-30" />
            <p className="mt-4">{t.startTyping}</p>
            <Link
              href="/catalog"
              className="mt-6 inline-block font-heading text-sm font-semibold uppercase tracking-wide text-accent-text transition-colors hover:underline"
            >
              {t.browseCatalog}
            </Link>
          </div>
        ) : results.length === 0 ? (
          /* Query, no matches */
          <div className="mt-20 mb-10 text-center">
            <SearchIcon className="mx-auto h-10 w-10 text-subtle opacity-30" />
            <p className="mt-4 font-heading text-xl font-semibold uppercase tracking-wide text-heading">
              {t.empty}
            </p>
            <p className="mt-2 text-subtle">{t.emptyHint}</p>
            <Link
              href="/catalog"
              className="mt-6 inline-block font-heading text-sm font-semibold uppercase tracking-wide text-accent-text transition-colors hover:underline"
            >
              {t.browseCatalog}
            </Link>
          </div>
        ) : (
          /* Results */
          <div className="mt-8 grid grid-cols-2 gap-5 md:grid-cols-3 xl:grid-cols-4">
            {results.map((p) => (
              <ProductCard
                key={p.id}
                product={p}
                locale={locale}
                statusLabel={dict.status[p.status]}
                scaleWord={dict.catalogSection.scaleWord}
                addToCartLabel={dict.common.addToCart}
              />
            ))}
          </div>
        )}
      </Container>
    </section>
  );
}
