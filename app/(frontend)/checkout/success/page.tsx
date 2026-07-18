import type { Metadata } from 'next';
import { OrderSuccess } from '@/components/OrderSuccess';

export const metadata: Metadata = {
  title: 'Спасибо за заказ — AZERII',
};

export default async function CheckoutSuccessPage({
  searchParams,
}: {
  searchParams: Promise<{ order?: string }>;
}) {
  const { order } = await searchParams;
  return <OrderSuccess orderId={(order ?? '').trim()} />;
}
