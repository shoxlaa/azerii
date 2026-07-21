import type { Metadata } from 'next';
import { HistoryView } from '@/components/HistoryView';
import { getProductsSafe } from '@/lib/data';
import { buildTimeline } from '@/lib/museum';

export const metadata: Metadata = {
  title: 'История брони — AZERII',
  description: 'История бронетехники, которую мы воссоздаём в масштабе 1:16.',
};

export default async function HistoryPage() {
  const products = await getProductsSafe();

  return <HistoryView timeline={buildTimeline(products)} />;
}
