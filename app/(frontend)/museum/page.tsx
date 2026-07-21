import type { Metadata } from 'next';
import { MuseumView } from '@/components/MuseumView';
import { MUSEUM_HISTORY } from '@/constants/museumHistory';
import { getMuseumItemsSafe, getProductsSafe } from '@/lib/data';
import type { MuseumTimelineEntry } from '@/types';

export const metadata: Metadata = {
  title: 'Музей — AZERII',
  description: 'История бронетехники, которую мы воссоздаём в масштабе 1:16.',
};

/**
 * Join the catalog to the curated history notes.
 *
 * A product reaches the timeline only when someone has written a history for
 * it, which is what keeps chassis, track sets and other parts off the page.
 * The note is the source of the year and the technical data; the product
 * supplies the name, the photograph and the link to its own page.
 */
function buildTimeline(
  products: Awaited<ReturnType<typeof getProductsSafe>>,
): MuseumTimelineEntry[] {
  return products
    .flatMap((product) => {
      const history = MUSEUM_HISTORY[product.slug];
      if (!history) return [];
      return [
        {
          slug: product.slug,
          name: product.name,
          image: product.images[0],
          ...history,
        },
      ];
    })
    .sort((a, b) => a.year - b.year);
}

export default async function MuseumPage() {
  // No demo fallback for exhibits: an empty museum shows its empty state
  // rather than inventing exhibits that do not exist.
  const [items, products] = await Promise.all([getMuseumItemsSafe(), getProductsSafe()]);

  return <MuseumView items={items} timeline={buildTimeline(products)} />;
}
