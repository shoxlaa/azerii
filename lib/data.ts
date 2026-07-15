import 'server-only';

/**
 * Data client — reads catalog data from Payload via the Local API.
 *
 * The public function signatures are unchanged (`getProducts`,
 * `getProductBySlug`) so storefront pages don't need to change.
 * Payload documents are mapped to our domain `Product` type.
 *
 * If Payload/DB is not configured yet, the functions degrade gracefully
 * (empty result) so the storefront never crashes before setup.
 */

import { getPayload } from 'payload';
import config from '@payload-config';
import type { CategoryType, Locale, Product, ProductStatus, TechType } from '@/types';

/** Minimal shape of a Payload product document we rely on. */
interface PayloadProduct {
  id: string | number;
  catalogCode: string;
  name: Record<Locale, string> | string;
  description?: Record<Locale, unknown> | unknown;
  type: CategoryType;
  technology?: TechType[];
  scale?: string;
  price: number;
  status: ProductStatus;
  images?: Array<{ url?: string | null } | string | number> | null;
  createdAt: string;
  updatedAt: string;
}

/** Extract plain text from a Lexical rich-text value. */
function lexicalToPlain(value: unknown): string {
  const root = (value as { root?: { children?: unknown[] } })?.root;
  if (!root?.children) return '';
  const walk = (nodes: unknown[]): string =>
    nodes
      .map((n) => {
        const node = n as { text?: string; children?: unknown[] };
        if (typeof node.text === 'string') return node.text;
        if (Array.isArray(node.children)) return walk(node.children);
        return '';
      })
      .join('');
  return walk(root.children).trim();
}

/** Coerce a possibly-localized value into our `Localized` string record. */
function toLocalized(
  value: Record<Locale, unknown> | unknown,
  transform: (v: unknown) => string = (v) => (typeof v === 'string' ? v : ''),
): Record<Locale, string> {
  const v = value as Record<string, unknown>;
  const isLocalized = v && typeof v === 'object' && ('en' in v || 'ru' in v);
  return {
    en: transform(isLocalized ? v.en : value),
    ru: transform(isLocalized ? v.ru : value),
  };
}

/** Map a Payload product document to our domain `Product`. */
function mapProduct(doc: PayloadProduct): Product {
  const images =
    (doc.images ?? [])
      .map((img) => (typeof img === 'object' && img ? img.url : null))
      .filter((url): url is string => Boolean(url)) ?? [];

  return {
    id: String(doc.id),
    slug: doc.catalogCode,
    name: toLocalized(doc.name),
    description: toLocalized(doc.description, lexicalToPlain),
    category: doc.type,
    tech: (doc.technology?.[0] ?? 'litnik') as TechType,
    status: doc.status,
    priceEur: doc.price,
    scale: doc.scale ?? '',
    images,
    createdAt: doc.createdAt,
    updatedAt: doc.updatedAt,
  };
}

/** Return all products. */
export async function getProducts(): Promise<Product[]> {
  try {
    const payload = await getPayload({ config });
    const { docs } = await payload.find({
      collection: 'products',
      locale: 'all',
      depth: 1,
      limit: 1000,
    });
    return (docs as unknown as PayloadProduct[]).map(mapProduct);
  } catch (err) {
    console.error('[data] getProducts failed (is DATABASE_URI set?):', err);
    return [];
  }
}

/** Return a single product by slug (catalogCode), or null if not found. */
export async function getProductBySlug(slug: string): Promise<Product | null> {
  try {
    const payload = await getPayload({ config });
    const { docs } = await payload.find({
      collection: 'products',
      where: { catalogCode: { equals: slug } },
      locale: 'all',
      depth: 1,
      limit: 1,
    });
    const doc = (docs as unknown as PayloadProduct[])[0];
    return doc ? mapProduct(doc) : null;
  } catch (err) {
    console.error('[data] getProductBySlug failed (is DATABASE_URI set?):', err);
    return null;
  }
}
