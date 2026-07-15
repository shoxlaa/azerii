'use client';

import { useState } from 'react';
import type { Product } from '@/types';
import { CATEGORY_TYPES, PRODUCT_STATUSES, TECH_TYPES } from '@/constants';
import { getDictionary } from '@/i18n';
import { useLocale } from '@/i18n/locale-context';
import { useFilters, type SortKey } from '@/hooks/useFilters';
import { Container } from './ui/Container';
import { ProductCard } from './ProductCard';
import { FilterIcon } from './icons';

export function CatalogView({ products }: { products: Product[] }) {
  const { locale } = useLocale();
  const dict = getDictionary(locale);
  const t = dict.catalogPage;
  const f = useFilters(products);
  const [open, setOpen] = useState(false);

  const sortOptions: { value: SortKey; label: string }[] = [
    { value: 'newest', label: t.sort.newest },
    { value: 'price-asc', label: t.sort.priceAsc },
    { value: 'price-desc', label: t.sort.priceDesc },
    { value: 'availability', label: t.sort.availability },
  ];

  return (
    <section className="py-12 md:py-16">
      <Container>
        {/* Header */}
        <h1 className="font-display text-[40px] font-bold uppercase tracking-[1px] text-heading md:text-[56px]">
          {t.title}
        </h1>
        <p className="mt-1 text-subtle">
          {f.filtered.length} {t.found}
        </p>

        {/* Toolbar */}
        <div className="mt-6 flex items-center justify-between gap-3">
          <button
            type="button"
            onClick={() => setOpen((v) => !v)}
            aria-expanded={open}
            className="inline-flex items-center gap-2 rounded-[4px] border border-border px-4 py-2 font-heading text-sm font-semibold uppercase tracking-wide text-body transition-colors hover:border-gold hover:text-gold md:hidden"
          >
            <FilterIcon className="h-4 w-4" />
            {t.filters}
            {f.activeCount > 0 ? ` (${f.activeCount})` : ''}
          </button>

          <label className="ml-auto flex items-center gap-2 text-sm text-subtle">
            <span className="hidden sm:inline">{t.sort.label}:</span>
            <select
              value={f.sort}
              onChange={(e) => f.setSort(e.target.value as SortKey)}
              className="rounded-[4px] border border-border bg-panel px-3 py-2 font-heading text-sm uppercase tracking-wide text-body outline-none focus:border-gold"
            >
              {sortOptions.map((o) => (
                <option key={o.value} value={o.value}>
                  {o.label}
                </option>
              ))}
            </select>
          </label>
        </div>

        {/* Filters */}
        <div
          className={`${open ? 'block' : 'hidden'} mt-5 rounded-md border border-border bg-panel p-4 md:block md:p-5`}
        >
          <div className="flex flex-col gap-5 md:flex-row md:flex-wrap md:gap-x-10 md:gap-y-5">
            <FilterGroup
              title={t.groups.type}
              options={CATEGORY_TYPES}
              selected={f.types}
              onToggle={f.toggleType}
              label={(k) => dict.category[k]}
            />
            <FilterGroup
              title={t.groups.technology}
              options={TECH_TYPES}
              selected={f.techs}
              onToggle={f.toggleTech}
              label={(k) => dict.tech[k]}
            />
            <FilterGroup
              title={t.groups.availability}
              options={PRODUCT_STATUSES}
              selected={f.statuses}
              onToggle={f.toggleStatus}
              label={(k) => dict.status[k]}
            />
          </div>
          {f.activeCount > 0 ? (
            <button
              type="button"
              onClick={f.reset}
              className="mt-4 font-heading text-sm font-semibold uppercase tracking-wide text-gold transition-colors hover:text-gold-hover"
            >
              {t.reset}
            </button>
          ) : null}
        </div>

        {/* Grid / empty */}
        {f.filtered.length === 0 ? (
          <div className="mt-20 mb-10 text-center">
            <p className="font-heading text-xl font-semibold uppercase tracking-wide text-heading">
              {t.empty}
            </p>
            <p className="mt-2 text-subtle">{t.emptyHint}</p>
          </div>
        ) : (
          <div className="mt-8 grid grid-cols-2 gap-5 md:grid-cols-3 xl:grid-cols-4">
            {f.filtered.map((p) => (
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

function FilterGroup<T extends string>({
  title,
  options,
  selected,
  onToggle,
  label,
}: {
  title: string;
  options: readonly T[];
  selected: T[];
  onToggle: (value: T) => void;
  label: (value: T) => string;
}) {
  return (
    <div>
      <p className="mb-2.5 font-heading text-xs font-semibold uppercase tracking-wide text-subtle">
        {title}
      </p>
      <div className="flex flex-wrap gap-2">
        {options.map((opt) => {
          const active = selected.includes(opt);
          return (
            <button
              key={opt}
              type="button"
              onClick={() => onToggle(opt)}
              aria-pressed={active}
              className={`rounded-full border px-3 py-1.5 font-heading text-xs uppercase tracking-wide transition-colors ${
                active
                  ? 'border-gold bg-gold-bg text-black'
                  : 'border-border text-body hover:border-gold hover:text-gold'
              }`}
            >
              {label(opt)}
            </button>
          );
        })}
      </div>
    </div>
  );
}
