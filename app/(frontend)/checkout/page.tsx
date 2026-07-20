import type { Metadata } from 'next';
import { CheckoutForm } from '@/components/CheckoutForm';
import { getProductsSafe } from '@/lib/data';

export const metadata: Metadata = {
  title: 'Оформление заказа — AZERII',
};

export default async function CheckoutPage() {
  // Summary prices come from the catalog so they match what the order action
  // actually charges (it re-reads authoritative prices server-side).
  const catalog = await getProductsSafe();

  return <CheckoutForm catalog={catalog} />;
}
