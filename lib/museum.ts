import type { MuseumTimelineEntry, Product } from '@/types';

/**
 * Flatten each product's history into a timeline entry.
 *
 * A product reaches the timeline only when an editor has filled in its history
 * year, which is what keeps chassis, track sets and other parts off the page.
 * The history block is the source of the year and the technical data; the
 * product supplies the name, the photograph and the link to its own page.
 *
 * Photograph: the two surfaces read from opposite ends of the same list. The
 * catalog shows `images[0]`, so the museum takes the *last* image instead —
 * that way an editor can give a model a different portrait here by putting it
 * last on the product, without disturbing the catalog. A product with a single
 * photograph naturally shows the same one in both places.
 *
 * Shared by /history, which shows the whole ribbon, and the home page, which
 * teases the opening entries — both must order and join identically.
 */
export function buildTimeline(products: Product[]): MuseumTimelineEntry[] {
  return products
    .flatMap((product) => {
      const history = product.history;
      // Year is the trigger; `mapHistory` guarantees it is a number when set.
      if (typeof history?.year !== 'number') return [];
      return [
        {
          slug: product.slug,
          name: product.name,
          image: product.images.at(-1),
          year: history.year,
          country: history.country ?? '',
          crew: history.crew ?? '',
          armor: history.armor ?? '',
          engine: history.engine ?? '',
          weight: history.weight ?? '',
        },
      ];
    })
    .sort((a, b) => a.year - b.year);
}
