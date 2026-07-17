import { NextResponse, type NextRequest } from 'next/server';
import { getProducts } from '@/lib/data';
import { SAMPLE_PRODUCTS } from '@/constants/sampleProducts';
import { searchProducts } from '@/lib/search';

/** Max suggestions returned to the header dropdown. */
const SUGGEST_LIMIT = 6;

/**
 * GET /search/suggest?q=… — live search suggestions for the header overlay.
 * Reads real products from Payload, falling back to demo data, and returns a
 * trimmed shape (just what the dropdown renders).
 */
export async function GET(request: NextRequest) {
  const q = request.nextUrl.searchParams.get('q') ?? '';
  const products = await getProducts();
  const items = products.length > 0 ? products : SAMPLE_PRODUCTS;

  const results = searchProducts(items, q)
    .slice(0, SUGGEST_LIMIT)
    .map((p) => ({
      id: p.id,
      slug: p.slug,
      name: p.name,
      category: p.category,
      priceEur: p.priceEur,
      image: p.images[0] ?? null,
    }));

  return NextResponse.json({ results });
}
