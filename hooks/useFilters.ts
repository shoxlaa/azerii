'use client';

import { useCallback, useMemo } from 'react';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import { CATEGORY_TYPES, PRODUCT_STATUSES, TECH_TYPES } from '@/constants';
import type {
  CategoryType,
  Product,
  ProductStatus,
  TechType,
} from '@/types';

export type SortKey = 'newest' | 'price-asc' | 'price-desc' | 'availability';

const SORT_KEYS: SortKey[] = ['newest', 'price-asc', 'price-desc', 'availability'];

/** Query-string keys for each facet. */
const PARAM = { types: 'category', techs: 'tech', statuses: 'status' } as const;

/** Order used for the "by availability" sort (in-stock first). */
const AVAILABILITY_ORDER: Record<ProductStatus, number> = {
  in_stock: 0,
  limited: 1,
  coming_soon: 2,
  in_development: 3,
  planned: 4,
  out_of_stock: 5,
  discontinued: 6,
};

function toggle<T>(list: T[], value: T): T[] {
  return list.includes(value) ? list.filter((v) => v !== value) : [...list, value];
}

/**
 * Read one facet from the query string. Values are accepted either repeated
 * (`?category=tank&category=tracks`) or comma-joined (`?category=tank,tracks`);
 * anything not in `allowed` is dropped, so a hand-edited URL can't poison state.
 * Returns them in `allowed` order so the URL stays stable regardless of the
 * order the user clicked the boxes in.
 */
function readFacet<T extends string>(
  search: string,
  key: string,
  allowed: readonly T[],
): T[] {
  const raw = new URLSearchParams(search).getAll(key).flatMap((v) => v.split(','));
  return allowed.filter((option) => raw.includes(option));
}

/**
 * useFilters — filtering & sorting for the catalog, with the query string as
 * the single source of truth. That makes filtered views linkable (the footer
 * category links rely on it) and makes back/forward restore the last selection.
 * Empty filter arrays mean "no restriction" for that facet.
 */
export function useFilters(products: Product[]) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const search = searchParams.toString();

  // Keyed on the raw query string so the arrays keep a stable identity across
  // re-renders and the filtering memo below actually holds.
  const types = useMemo(() => readFacet(search, PARAM.types, CATEGORY_TYPES), [search]);
  const techs = useMemo(() => readFacet(search, PARAM.techs, TECH_TYPES), [search]);
  const statuses = useMemo(
    () => readFacet(search, PARAM.statuses, PRODUCT_STATUSES),
    [search],
  );

  const sortParam = searchParams.get('sort') as SortKey | null;
  const sort: SortKey = sortParam && SORT_KEYS.includes(sortParam) ? sortParam : 'newest';

  /** Rewrite the query string in place — no history entry, no scroll jump. */
  const commit = useCallback(
    (mutate: (params: URLSearchParams) => void) => {
      const next = new URLSearchParams(search);
      mutate(next);
      const qs = next.toString();
      router.replace(qs ? `${pathname}?${qs}` : pathname, { scroll: false });
    },
    [search, pathname, router],
  );

  const toggleFacet = useCallback(
    <T extends string>(key: string, allowed: readonly T[], value: T) =>
      commit((params) => {
        const current = readFacet(params.toString(), key, allowed);
        const selected = toggle(current, value);
        params.delete(key);
        // Re-derive from `allowed` so the param order never depends on clicks.
        const ordered = allowed.filter((option) => selected.includes(option));
        if (ordered.length > 0) params.set(key, ordered.join(','));
      }),
    [commit],
  );

  const filtered = useMemo(() => {
    const result = products.filter(
      (p) =>
        (types.length === 0 || types.includes(p.category)) &&
        (techs.length === 0 || techs.includes(p.tech)) &&
        (statuses.length === 0 || statuses.includes(p.status)),
    );

    return result.sort((a, b) => {
      switch (sort) {
        case 'price-asc':
          return a.priceEur - b.priceEur;
        case 'price-desc':
          return b.priceEur - a.priceEur;
        case 'availability':
          return AVAILABILITY_ORDER[a.status] - AVAILABILITY_ORDER[b.status];
        case 'newest':
        default:
          return b.createdAt.localeCompare(a.createdAt);
      }
    });
  }, [products, types, techs, statuses, sort]);

  const activeCount = types.length + techs.length + statuses.length;

  return {
    types,
    techs,
    statuses,
    sort,
    filtered,
    activeCount,
    setSort: (v: SortKey) =>
      commit((params) => {
        // 'newest' is the default — leave it out to keep shared URLs tidy.
        if (v === 'newest') params.delete('sort');
        else params.set('sort', v);
      }),
    toggleType: (v: CategoryType) => toggleFacet(PARAM.types, CATEGORY_TYPES, v),
    toggleTech: (v: TechType) => toggleFacet(PARAM.techs, TECH_TYPES, v),
    toggleStatus: (v: ProductStatus) => toggleFacet(PARAM.statuses, PRODUCT_STATUSES, v),
    reset: () =>
      commit((params) => {
        params.delete(PARAM.types);
        params.delete(PARAM.techs);
        params.delete(PARAM.statuses);
      }),
  };
}
