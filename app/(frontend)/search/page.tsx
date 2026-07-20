import type { Metadata } from 'next';
import { SearchView } from '@/components/SearchView';
import { getProductsSafe } from '@/lib/data';
import { searchProducts } from '@/lib/search';

export const metadata: Metadata = {
  title: 'Поиск — AZERII',
};

export default async function SearchPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string }>;
}) {
  const { q } = await searchParams;
  const query = (q ?? '').trim();

  const items = await getProductsSafe();
  const results = query ? searchProducts(items, query) : [];

  return <SearchView query={query} results={results} />;
}
