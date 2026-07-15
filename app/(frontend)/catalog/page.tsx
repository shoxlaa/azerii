import type { Metadata } from 'next';
import { CatalogView } from '@/components/CatalogView';
import { getProducts } from '@/lib/data';
import { SAMPLE_PRODUCTS } from '@/constants/sampleProducts';

export const metadata: Metadata = {
  title: 'Каталог — AZERII',
};

export default async function CatalogPage() {
  // Real products from Payload; fall back to demo data until the catalog is populated.
  const products = await getProducts();
  const items = products.length > 0 ? products : SAMPLE_PRODUCTS;

  return <CatalogView products={items} />;
}
