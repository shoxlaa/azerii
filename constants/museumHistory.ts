/**
 * Curated history notes for the museum timeline.
 *
 * Deliberately kept out of the `products` collection: most of the catalog
 * (chassis, track sets, spare parts) has no history to tell, and forcing these
 * fields into the product form would make every editor fill in six boxes that
 * apply only to complete vehicles. History here is presentation, not
 * inventory — a model reaches the timeline only because someone wrote an
 * entry for it, and deleting an entry quietly removes the block.
 *
 * Keyed by the product's catalog code (its slug), so a note joins onto the
 * real product and inherits that product's name and photographs. A key that
 * matches no product is simply skipped, so a renamed or retired product
 * cannot break the page.
 *
 * The figures describe the historical vehicle, not the kit, and use the
 * values usually quoted in reference works. They are editorial content: check
 * them against your own sources before publishing.
 */

/** Technical data of the original vehicle, as displayed. */
export interface ModelHistory {
  /** Year the original entered service — the timeline sorts on this. */
  year: number;
  /** Country of origin, shown in Latin exactly as written here. */
  country: string;
  /** Values carry their own units: they are printed verbatim, not localized. */
  crew: string;
  armor: string;
  engine: string;
  weight: string;
}

export const MUSEUM_HISTORY: Record<string, ModelHistory> = {
  'az-tnk-vickers-mk-e': {
    year: 1928,
    country: 'United Kingdom',
    crew: '3',
    armor: '13 mm',
    engine: '80 hp',
    weight: '7.2 t',
  },
  'az-tnk-t-26-1932': {
    year: 1932,
    country: 'USSR',
    crew: '3',
    armor: '15 mm',
    engine: '90 hp',
    weight: '8.2 t',
  },
  'az-tnk-t-28-kt-28': {
    year: 1933,
    country: 'USSR',
    crew: '6',
    armor: '30 mm',
    engine: '500 hp',
    weight: '25.4 t',
  },
  'az-tnk-t-26-1933': {
    year: 1933,
    country: 'USSR',
    crew: '3',
    armor: '15 mm',
    engine: '90 hp',
    weight: '9.4 t',
  },
  'az-tnk-t-29-5': {
    year: 1934,
    country: 'USSR',
    crew: '5',
    armor: '30 mm',
    engine: '500 hp',
    weight: '28.5 t',
  },
  'az-tnk-t-26-1934': {
    year: 1934,
    country: 'USSR',
    crew: '3',
    armor: '15 mm',
    engine: '90 hp',
    weight: '9.6 t',
  },
  'az-tnk-somua-s35': {
    year: 1935,
    country: 'France',
    crew: '3',
    armor: '47 mm',
    engine: '190 hp',
    weight: '19.5 t',
  },
  'az-tnk-7tp-tank-model-set': {
    year: 1935,
    country: 'Poland',
    crew: '3',
    armor: '17 mm',
    engine: '110 hp',
    weight: '9.9 t',
  },
  'az-tnk-renault-d2': {
    year: 1936,
    country: 'France',
    crew: '3',
    armor: '40 mm',
    engine: '150 hp',
    weight: '19.8 t',
  },
  'az-tnk-char-b1-bis': {
    year: 1937,
    country: 'France',
    crew: '4',
    armor: '60 mm',
    engine: '307 hp',
    weight: '31.5 t',
  },
  'az-tnk-t-26-1938': {
    year: 1938,
    country: 'USSR',
    crew: '3',
    armor: '15 mm',
    engine: '95 hp',
    weight: '10.3 t',
  },
  'az-tnk-t-26-1939': {
    year: 1939,
    country: 'USSR',
    crew: '3',
    armor: '20 mm',
    engine: '97 hp',
    weight: '10.3 t',
  },
  'az-tnk-t-50': {
    year: 1941,
    country: 'USSR',
    crew: '4',
    armor: '37 mm',
    engine: '300 hp',
    weight: '13.8 t',
  },
  'az-tnk-t-70': {
    year: 1942,
    country: 'USSR',
    crew: '2',
    armor: '45 mm',
    engine: '140 hp',
    weight: '9.2 t',
  },
};
