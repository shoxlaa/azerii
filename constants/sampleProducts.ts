import type { CategoryType, Product, ProductStatus, TechType } from '@/types';

/**
 * Demo products — a fallback used when the Payload database has no products
 * yet. Real products created in /admin take precedence. Images reuse the hero
 * photos. Categories/technologies are varied so the catalog filters are
 * demonstrable; `somua-s35` has several images to demo the product gallery.
 */
const now = '2024-01-01T00:00:00.000Z';

function make(
  slug: string,
  name: string,
  category: CategoryType,
  tech: TechType,
  status: ProductStatus,
  priceEur: number,
  images: string[],
): Product {
  return {
    id: slug,
    slug,
    name: { en: name, ru: name },
    description: { en: '', ru: '' },
    category,
    tech,
    status,
    priceEur,
    scale: '1:16',
    images,
    createdAt: now,
    updatedAt: now,
  };
}

export const SAMPLE_PRODUCTS: Product[] = [
  make('somua-s35', 'SOMUA S-35', 'tank', 'litnik', 'in_stock', 49900, [
    '/hero/somua-s35.jpg',
    '/hero/hero-b1-reims.jpg',
    '/hero/hero-t28-polygon.jpg',
    '/hero/hero-german-field.jpg',
  ]),
  make('b1-bis', 'B1 bis', 'tank', 'rezin', 'coming_soon', 65000, ['/hero/hero-b1-reims.jpg']),
  make('t-28', 'T-28', 'tank', '3d', 'in_stock', 72000, ['/hero/hero-t28-polygon.jpg']),
  make('nb-fz', 'Nb.Fz.', 'tank', 'lazer', 'limited', 89000, ['/hero/hero-german-field.jpg']),
  make('ba-6', 'БА-6', 'armored_car', 'litnik', 'out_of_stock', 54000, ['/hero/somua-s35.jpg']),
  make('t-26-1938', 'T-26 (1938)', 'tank', '3d', 'in_stock', 48000, ['/hero/hero-t28-polygon.jpg']),
  make('t-26-chassis', 'Шасси T-26', 'chassis', 'rezin', 'planned', 28000, ['/hero/hero-b1-reims.jpg']),
  make('t-26-tracks', 'Траки T-26', 'tracks', 'lazer', 'in_development', 12000, ['/hero/hero-german-field.jpg']),
];
