import type { Metadata } from 'next';
import { MuseumView } from '@/components/MuseumView';
import { getMuseumItemsSafe } from '@/lib/data';

export const metadata: Metadata = {
  title: 'Музей — AZERII',
  description: 'Галерея готовых моделей, собранных нашими юными моделистами.',
};

export default async function MuseumPage() {
  // No demo fallback here: an empty museum shows its empty state rather than
  // inventing exhibits that do not exist.
  const items = await getMuseumItemsSafe();
  return <MuseumView items={items} />;
}
