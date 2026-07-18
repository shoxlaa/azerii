import type { Metadata } from 'next';
import { CartView } from '@/components/CartView';
import { getProducts } from '@/lib/data';
import { SAMPLE_PRODUCTS } from '@/constants/sampleProducts';

export const metadata: Metadata = {
  title: 'Корзина — AZERII',
};

export default async function CartPage() {
  // The cart is persisted client-side, but names/prices/images are re-read
  // from the catalog so a stale snapshot never reaches the screen.
  const products = await getProducts();
  const catalog = products.length > 0 ? products : SAMPLE_PRODUCTS;

  return <CartView catalog={catalog} />;
}
