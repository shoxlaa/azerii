import { NextResponse, type NextRequest } from 'next/server';
import { getProductsSafe } from '@/lib/data';
import { searchProducts } from '@/lib/search';

/** Max suggestions returned to the header dropdown. */
const SUGGEST_LIMIT = 6;

/**
 * GET /search/suggest?q=… — live search suggestions for the header overlay.
 * Returns a trimmed shape — just what the dropdown renders.
 */
export async function GET(request: NextRequest) {
  const q = request.nextUrl.searchParams.get('q') ?? '';
  const items = await getProductsSafe();

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
