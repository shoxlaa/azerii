import { MUSEUM_HISTORY } from '@/constants/museumHistory';
import type { MuseumTimelineEntry, Product } from '@/types';

/**
 * Join the catalog to the curated history notes.
 *
 * A product reaches the timeline only when someone has written a history for
 * it, which is what keeps chassis, track sets and other parts off the page.
 * The note is the source of the year and the technical data; the product
 * supplies the name, the photograph and the link to its own page.
 *
 * Photograph: the two surfaces read from opposite ends of the same list. The
 * catalog shows `images[0]`, so the museum takes the *last* image instead —
 * that way an editor can give a model a different portrait here by putting it
 * last on the product, without disturbing the catalog. A product with a single
 * photograph naturally shows the same one in both places.
 *
 * Shared by /museum, which shows the whole ribbon, and the home page, which
 * teases the opening entries — both must order and join identically.
 */
export function buildTimeline(products: Product[]): MuseumTimelineEntry[] {
  return products
    .flatMap((product) => {
      const history = MUSEUM_HISTORY[product.slug];
      if (!history) return [];
      return [
        {
          slug: product.slug,
          name: product.name,
          image: product.images.at(-1),
          ...history,
        },
      ];
    })
    .sort((a, b) => a.year - b.year);
}
