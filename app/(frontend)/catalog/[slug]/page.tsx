import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { ProductDetail } from '@/components/ProductDetail';
import { getProductBySlug, getProducts } from '@/lib/data';
import { SAMPLE_PRODUCTS } from '@/constants/sampleProducts';
import type { Product } from '@/types';

/** Resolve a product by slug: Payload first, then demo fallback. */
async function getProduct(slug: string): Promise<Product | null> {
  const product = await getProductBySlug(slug);
  if (product) return product;
  return SAMPLE_PRODUCTS.find((p) => p.slug === slug) ?? null;
}

export async function generateStaticParams() {
  const products = await getProducts();
  const items = products.length > 0 ? products : SAMPLE_PRODUCTS;
  return items.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const product = await getProduct(slug);
  return { title: product ? `${product.name.en} — AZERII` : 'AZERII' };
}

export default async function ProductPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const product = await getProduct(slug);
  if (!product) notFound();
  return <ProductDetail product={product} />;
}
