import type { Metadata } from 'next';
import { notFound, redirect } from 'next/navigation';
import { ProductDetail } from '@/components/ProductDetail';
import { getProductBySlug } from '@/lib/data';
import { SAMPLE_PRODUCTS } from '@/constants/sampleProducts';
import { slugify } from '@/lib/slug';
import type { Product } from '@/types';

/**
 * Route params arrive percent-encoded, so a slug containing a space or
 * non-ASCII characters (e.g. "AZ-TNK%20test") must be decoded before it can be
 * matched against stored slugs. Malformed sequences fall back to the raw value.
 */
function decodeSlug(raw: string): string {
  try {
    return decodeURIComponent(raw);
  } catch {
    return raw;
  }
}

/** Resolve a product by slug: Payload first, then demo fallback. */
async function getProduct(slug: string): Promise<Product | null> {
  const product = await getProductBySlug(slug);
  if (product) return product;
  return SAMPLE_PRODUCTS.find((p) => p.slug === slug) ?? null;
}

// No generateStaticParams: the root layout reads the locale cookie, so these
// pages are always rendered per-request. Declaring static params made Next mark
// the route SSG and then fail at request time with DYNAMIC_SERVER_USAGE.

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const product = await getProduct(decodeSlug(slug));
  return { title: product ? `${product.name.en} — AZERII` : 'AZERII' };
}

export default async function ProductPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug: rawSlug } = await params;
  const slug = decodeSlug(rawSlug);
  const product = await getProduct(slug);

  if (!product) {
    // An old or hand-written link (e.g. one containing a space or Cyrillic).
    // If the normalized slug resolves, send the visitor to the canonical URL
    // rather than a dead end; otherwise fall through to a proper 404.
    const normalized = slugify(slug);
    if (normalized && normalized !== slug && (await getProduct(normalized))) {
      redirect(`/catalog/${normalized}`);
    }
    notFound();
  }

  return <ProductDetail product={product} />;
}
