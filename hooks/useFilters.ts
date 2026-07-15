'use client';

import { useMemo, useState } from 'react';
import type {
  CategoryType,
  Product,
  ProductStatus,
  TechType,
} from '@/types';

export type SortKey = 'newest' | 'price-asc' | 'price-desc' | 'availability';

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
 * useFilters — client-side filtering & sorting for the catalog.
 * Empty filter arrays mean "no restriction" for that facet.
 */
export function useFilters(products: Product[]) {
  const [types, setTypes] = useState<CategoryType[]>([]);
  const [techs, setTechs] = useState<TechType[]>([]);
  const [statuses, setStatuses] = useState<ProductStatus[]>([]);
  const [sort, setSort] = useState<SortKey>('newest');

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
    setSort,
    filtered,
    activeCount,
    toggleType: (v: CategoryType) => setTypes((l) => toggle(l, v)),
    toggleTech: (v: TechType) => setTechs((l) => toggle(l, v)),
    toggleStatus: (v: ProductStatus) => setStatuses((l) => toggle(l, v)),
    reset: () => {
      setTypes([]);
      setTechs([]);
      setStatuses([]);
    },
  };
}
