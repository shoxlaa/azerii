/**
 * Application-wide constants for AZERII.
 *
 * Grouped by concern: brand colors, product statuses, tech types,
 * categories, navigation menu and social links.
 */

import type {
  CategoryType,
  ProductStatus,
  TechType,
} from '@/types';

/** Brand color palette. */
export const COLORS = {
  primary: '#1a1a1a',
  accent: '#c8a24a', // brass / brushed-gold accent
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
  in_stock: '#5c8a3a',
  out_of_stock: '#b23a2e',
  coming_soon: '#c88a2c',
  planned: '#3b7fb0',
  discontinued: '#7a2a22',
  limited: '#9a6bb0',
  in_development: '#c88a2c',
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
