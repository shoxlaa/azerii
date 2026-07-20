import type { Metadata } from 'next';
import { CartView } from '@/components/CartView';
import { getProductsSafe } from '@/lib/data';

export const metadata: Metadata = {
  title: 'Корзина — AZERII',
};

export default async function CartPage() {
  // The cart is persisted client-side, but names/prices/images are re-read
  // from the catalog so a stale snapshot never reaches the screen.
  const catalog = await getProductsSafe();

  return <CartView catalog={catalog} />;
}
