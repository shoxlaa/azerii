import type { Metadata } from 'next';
import { NotFoundView } from '@/components/NotFoundView';

export const metadata: Metadata = {
  title: '404 — AZERII',
};

// The root layout reads the locale cookie, so this page cannot be prerendered
// statically — without this it ships an empty shell and renders client-side.
export const dynamic = 'force-dynamic';

/** Storefront 404 — shown for unknown routes and for notFound() from a page. */
export default function NotFound() {
  return <NotFoundView />;
}
