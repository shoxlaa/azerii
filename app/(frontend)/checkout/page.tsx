import type { Metadata } from 'next';
import { CheckoutForm } from '@/components/CheckoutForm';
import { getProducts } from '@/lib/data';
import { SAMPLE_PRODUCTS } from '@/constants/sampleProducts';

export const metadata: Metadata = {
  title: 'Оформление заказа — AZERII',
};

export default async function CheckoutPage() {
  // Summary prices come from the catalog so they match what the order action
  // actually charges (it re-reads authoritative prices server-side).
  const products = await getProducts();
  const catalog = products.length > 0 ? products : SAMPLE_PRODUCTS;

  return <CheckoutForm catalog={catalog} />;
}
