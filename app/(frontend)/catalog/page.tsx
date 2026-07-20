import type { Metadata } from 'next';
import { CatalogView } from '@/components/CatalogView';
import { getProductsSafe } from '@/lib/data';

export const metadata: Metadata = {
  title: 'Каталог — AZERII',
};

export default async function CatalogPage() {
  // Real products from Payload; fall back to demo data until the catalog is populated.
  const items = await getProductsSafe();

  return <CatalogView products={items} />;
}
