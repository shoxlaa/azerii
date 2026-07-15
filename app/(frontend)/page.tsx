import { Hero } from '@/components/Hero';
import { CatalogSection } from '@/components/CatalogSection';
import { FeaturesRow } from '@/components/FeaturesRow';
import { WorkshopSection } from '@/components/WorkshopSection';
import { PromoSection } from '@/components/PromoSection';
import { getProducts } from '@/lib/data';
import { SAMPLE_PRODUCTS } from '@/constants/sampleProducts';

export default async function Home() {
  // Real products from Payload; fall back to demo data until the catalog is populated.
  const products = await getProducts();
  const items = products.length > 0 ? products : SAMPLE_PRODUCTS;

  return (
    <>
      <Hero />
      <CatalogSection products={items} />
      <FeaturesRow />
      <WorkshopSection />
      <PromoSection />
    </>
  );
}
