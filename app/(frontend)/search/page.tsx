import type { Metadata } from 'next';
import { SearchView } from '@/components/SearchView';
import { getProducts } from '@/lib/data';
import { SAMPLE_PRODUCTS } from '@/constants/sampleProducts';
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

  // Real products from Payload; fall back to demo data until the catalog is populated.
  const products = await getProducts();
  const items = products.length > 0 ? products : SAMPLE_PRODUCTS;
  const results = query ? searchProducts(items, query) : [];

  return <SearchView query={query} results={results} />;
}
