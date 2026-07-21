/**
 * Application-wide constants for AZERII.
 *
 * Grouped by concern: brand colors, product statuses, tech types,
 * categories, navigation menu and social links.
 */

import type {
  CategoryType,
  ModelScale,
  MuseumCategory,
  PaintingMaterial,
  ProductStatus,
  TechType,
  WorkType,
} from '@/types';

/** Brand color palette. */
export const COLORS = {
  primary: '#1a1a1a',
  accent: '#4e5a2e', // olive military accent
  background: '#0a0a0a',
  surface: '#141414',
  muted: '#6b7280',
  danger: '#dc2626',
  success: '#16a34a',
} as const;

/** All product statuses in display order. */
export const PRODUCT_STATUSES: ProductStatus[] = [
  'in_stock',
  'limited',
  'coming_soon',
  'planned',
  'in_development',
  'out_of_stock',
  'discontinued',
];

/**
 * UI color mapped to each product status (used for badges).
 * Kept in sync with the `--color-status-*` tokens in globals.css.
 */
export const PRODUCT_STATUS_COLORS: Record<ProductStatus, string> = {
  in_stock: '#55702f',
  out_of_stock: '#8f3a2e',
  coming_soon: '#4a5a63',
  planned: '#6b6f7a',
  discontinued: '#5e2a22',
  limited: '#6b5a30',
  in_development: '#565c3a',
};

/** All manufacturing technologies in display order. */
export const TECH_TYPES: TechType[] = ['lazer', '3d', 'rezin', 'litnik'];

/** All product categories in display order. */
export const CATEGORY_TYPES: CategoryType[] = [
  'tank',
  'chassis',
  'tracks',
  'armored_car',
];

/** Museum exhibit categories in display order. */
export const MUSEUM_CATEGORIES: MuseumCategory[] = [
  'cars',
  'armor',
  'aviation',
  'miniatures',
  'railway',
  'ships',
];

/** Painting techniques in display order. */
export const WORK_TYPES: WorkType[] = [
  'oil',
  'acrylic',
  'watercolor',
  'graphics',
  'mixed',
  'print',
];

/** Painting surfaces in display order. */
export const PAINTING_MATERIALS: PaintingMaterial[] = [
  'canvas',
  'canvas_on_board',
  'paper',
  'wood',
];

/** Selectable model scales, largest first. */
export const MODEL_SCALES: ModelScale[] = [
  '1:8',
  '1:16',
  '1:18',
  '1:24',
  '1:35',
  '1:43',
  '1:64',
  '1:72',
  '1:144',
];

/**
 * Main navigation menu.
 * `labelKey` references a key in the i18n dictionaries (nav.*).
 */
export const NAV_MENU: { href: string; labelKey: string }[] = [
  { href: '/', labelKey: 'nav.home' },
  { href: '/catalog', labelKey: 'nav.catalog' },
  { href: '/about', labelKey: 'nav.about' },
  { href: '/contact', labelKey: 'nav.contact' },
];

/** Social media links shown in the footer (defined in ./socials). */
export { SOCIAL_LINKS } from './socials';
export type { SocialLink, SocialName } from './socials';

/** Currency used across the store. */
export const CURRENCY = 'EUR' as const;
