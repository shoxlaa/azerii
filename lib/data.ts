import 'server-only';

/**
 * Data client — reads catalog and museum data from Payload via the Local API.
 *
 * Payload documents are mapped to our domain types (`Product`, `MuseumItem`).
 * If Payload/DB is not configured yet, the functions degrade gracefully
 * (empty result) so the storefront never crashes before setup.
 */

import { getPayload } from 'payload';
import config from '@payload-config';
import type {
  CategoryType,
  Locale,
  ModelScale,
  MuseumCategory,
  MuseumItem,
  Product,
  ProductStatus,
  TechType,
} from '@/types';

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

/** Minimal shape of a Payload museum document we rely on. */
interface PayloadMuseumItem {
  id: string | number;
  title: Record<Locale, string> | string;
  description?: Record<Locale, unknown> | unknown;
  category: MuseumCategory;
  scale?: ModelScale | null;
  mainImage?: { url?: string | null } | string | number | null;
  gallery?: Array<{ url?: string | null } | string | number> | null;
  /** Populated at depth >= 1 when the exhibit links to a product. */
  product?: { catalogCode?: string | null } | string | number | null;
  createdAt: string;
  updatedAt: string;
}

/** Pull a usable URL off a populated upload field. */
function uploadUrl(value: unknown): string | null {
  return typeof value === 'object' && value
    ? ((value as { url?: string | null }).url ?? null)
    : null;
}

/** Map a Payload museum document to our domain `MuseumItem`. */
function mapMuseumItem(doc: PayloadMuseumItem): MuseumItem {
  // Main photo first, then any extra gallery shots.
  const images = [
    uploadUrl(doc.mainImage),
    ...(doc.gallery ?? []).map(uploadUrl),
  ].filter((url): url is string => Boolean(url));

  const productSlug =
    typeof doc.product === 'object' && doc.product
      ? ((doc.product as { catalogCode?: string | null }).catalogCode ?? undefined)
      : undefined;

  return {
    id: String(doc.id),
    title: toLocalized(doc.title),
    description: toLocalized(doc.description, lexicalToPlain),
    category: doc.category,
    scale: doc.scale ?? undefined,
    images,
    productSlug: productSlug || undefined,
    createdAt: doc.createdAt,
    updatedAt: doc.updatedAt,
  };
}

/** Return all museum exhibits, newest first. */
export async function getMuseumItems(): Promise<MuseumItem[]> {
  try {
    const payload = await getPayload({ config });
    const { docs } = await payload.find({
      collection: 'museum-items',
      locale: 'all',
      // depth 1 populates mainImage/gallery uploads and the product relation.
      depth: 1,
      limit: 500,
      sort: '-createdAt',
    });
    return (docs as unknown as PayloadMuseumItem[]).map(mapMuseumItem);
  } catch (err) {
    console.error('[data] getMuseumItems failed (is DATABASE_URI set?):', err);
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
