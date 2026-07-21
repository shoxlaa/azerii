import 'server-only';

/**
 * Data client — reads catalog, museum and gallery data from Payload via the
 * Local API.
 *
 * Payload documents are mapped to our domain types (`Product`, `MuseumItem`,
 * `Painting`).
 * If Payload/DB is not configured yet, the functions degrade gracefully
 * (empty result) so the storefront never crashes before setup.
 */

import { getPayload } from 'payload';
import config from '@payload-config';
import { SAMPLE_PRODUCTS } from '@/constants/sampleProducts';
import type {
  CategoryType,
  Locale,
  ModelScale,
  MuseumCategory,
  MuseumItem,
  Painting,
  PaintingMaterial,
  Product,
  ProductStatus,
  TechType,
  WorkType,
} from '@/types';

/**
 * Connection failures worth retrying rather than reporting as "no data".
 * Supabase's pooler rejects new clients once its 15 session slots are busy;
 * slots free up in milliseconds, so a short retry almost always succeeds.
 */
const TRANSIENT_DB_ERROR =
  /EMAXCONNSESSION|max clients|too many clients|ETIMEDOUT|ECONNRESET|ECONNREFUSED|Connection terminated/i;

/**
 * Flatten an error and its `cause` chain into one string.
 *
 * The driver wraps failures as `Failed query: select …` and keeps the real
 * reason (`EMAXCONNSESSION`, `ETIMEDOUT`, …) in a nested `cause`, so matching
 * on the top-level message alone silently misses every transient error.
 */
function describeError(err: unknown, depth = 0): string {
  if (!err || depth > 5) return '';
  if (err instanceof Error) {
    const cause = (err as Error & { cause?: unknown }).cause;
    return `${err.message} ${describeError(cause, depth + 1)}`;
  }
  return String(err);
}

/**
 * Run a database read, retrying briefly on transient connection errors.
 *
 * Throws if the database is genuinely unreachable. That matters: swallowing
 * the error and returning "nothing" made a real product look missing, and the
 * product page turned that into a 404 for an item that exists.
 */
async function withRetry<T>(label: string, run: () => Promise<T>, attempts = 4): Promise<T> {
  let lastError: unknown;

  for (let attempt = 1; attempt <= attempts; attempt++) {
    try {
      return await run();
    } catch (err) {
      lastError = err;
      if (!TRANSIENT_DB_ERROR.test(describeError(err)) || attempt === attempts) break;
      console.warn(`[data] ${label}: transient DB error, retrying (${attempt}/${attempts - 1})`);
      // Back off increasingly; pooler slots free up within a few hundred ms.
      await new Promise((resolve) => setTimeout(resolve, 200 * attempt));
    }
  }

  throw lastError;
}

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

/** Return all products. Throws if the database cannot be reached. */
export async function getProducts(): Promise<Product[]> {
  return withRetry('getProducts', async () => {
    const payload = await getPayload({ config });
    const { docs } = await payload.find({
      collection: 'products',
      locale: 'all',
      depth: 1,
      limit: 1000,
    });
    return (docs as unknown as PayloadProduct[]).map(mapProduct);
  });
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

/** Return all museum exhibits, newest first. Throws if the DB is unreachable. */
export async function getMuseumItems(): Promise<MuseumItem[]> {
  return withRetry('getMuseumItems', async () => {
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
  });
}

/** Minimal shape of a Payload painting document we rely on. */
interface PayloadPainting {
  id: string | number;
  title: Record<Locale, string> | string;
  description?: Record<Locale, unknown> | unknown;
  size: string;
  workType: WorkType;
  material: PaintingMaterial;
  price: number;
  mainImage?: { url?: string | null } | string | number | null;
  gallery?: Array<{ url?: string | null } | string | number> | null;
  createdAt: string;
  updatedAt: string;
}

/** Map a Payload painting document to our domain `Painting`. */
function mapPainting(doc: PayloadPainting): Painting {
  // Main photo first, then any extra shots — same order as museum exhibits.
  const images = [
    uploadUrl(doc.mainImage),
    ...(doc.gallery ?? []).map(uploadUrl),
  ].filter((url): url is string => Boolean(url));

  return {
    id: String(doc.id),
    title: toLocalized(doc.title),
    description: toLocalized(doc.description, lexicalToPlain),
    size: doc.size,
    workType: doc.workType,
    material: doc.material,
    // numeric(10,2) can arrive as a string from postgres.
    priceEur: Number(doc.price),
    images,
    createdAt: doc.createdAt,
    updatedAt: doc.updatedAt,
  };
}

/** Return all gallery paintings, newest first. Throws if the DB is unreachable. */
export async function getPaintings(): Promise<Painting[]> {
  return withRetry('getPaintings', async () => {
    const payload = await getPayload({ config });
    const { docs } = await payload.find({
      collection: 'paintings',
      locale: 'all',
      // depth 1 populates the mainImage/gallery uploads.
      depth: 1,
      limit: 500,
      sort: '-createdAt',
    });
    return (docs as unknown as PayloadPainting[]).map(mapPainting);
  });
}

/**
 * Catalog for pages that must still render during a brief database outage
 * (listings, cart and checkout summaries).
 *
 * Returns an empty catalog rather than failing the whole page. Demo products
 * stand in only during development — in production they would be fake
 * inventory a customer could add to the cart and order.
 */
export async function getProductsSafe(): Promise<Product[]> {
  try {
    return await getProducts();
  } catch (err) {
    console.error('[data] catalog unavailable, rendering without it:', err);
    return process.env.NODE_ENV === 'production' ? [] : SAMPLE_PRODUCTS;
  }
}

/** Museum exhibits for pages that should degrade to an empty gallery. */
export async function getMuseumItemsSafe(): Promise<MuseumItem[]> {
  try {
    return await getMuseumItems();
  } catch (err) {
    console.error('[data] museum unavailable, rendering without it:', err);
    return [];
  }
}

/** Gallery paintings for a page that should degrade to an empty gallery. */
export async function getPaintingsSafe(): Promise<Painting[]> {
  try {
    return await getPaintings();
  } catch (err) {
    console.error('[data] gallery unavailable, rendering without it:', err);
    return [];
  }
}

/**
 * Return a single product by slug (catalogCode).
 *
 * `null` means the product genuinely does not exist. A database failure throws
 * instead — the caller must not mistake an outage for a missing product and
 * answer 404.
 */
export async function getProductBySlug(slug: string): Promise<Product | null> {
  return withRetry('getProductBySlug', async () => {
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
  });
}
