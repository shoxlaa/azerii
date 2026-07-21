import type { Metadata } from 'next';
import { MuseumView } from '@/components/MuseumView';
import { getMuseumItemsSafe, getProductsSafe } from '@/lib/data';
import { buildTimeline } from '@/lib/museum';

export const metadata: Metadata = {
  title: 'Музей — AZERII',
  description: 'История бронетехники, которую мы воссоздаём в масштабе 1:16.',
};

export default async function MuseumPage() {
  // No demo fallback for exhibits: an empty museum shows its empty state
  // rather than inventing exhibits that do not exist.
  const [items, products] = await Promise.all([getMuseumItemsSafe(), getProductsSafe()]);

  return <MuseumView items={items} timeline={buildTimeline(products)} />;
}
