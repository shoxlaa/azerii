import { Suspense } from 'react';
import type { Metadata } from 'next';
import { CatalogView } from '@/components/CatalogView';
import { getProductsSafe } from '@/lib/data';

export const metadata: Metadata = {
  title: 'Каталог — AZERII',
};

export default async function CatalogPage() {
  // Real products from Payload; fall back to demo data until the catalog is populated.
  const items = await getProductsSafe();

  // CatalogView reads its filters from the query string via useSearchParams,
  // which requires a Suspense boundary or the production build fails.
  return (
    <Suspense fallback={null}>
      <CatalogView products={items} />
    </Suspense>
  );
}
