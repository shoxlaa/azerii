'use client';

import { useEffect } from 'react';
import { ErrorView } from '@/components/ErrorView';

/**
 * Storefront error boundary. Most failures here are a briefly unreachable
 * database, so the page offers a retry rather than a dead end.
 */
export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error('[storefront] render failed:', error);
  }, [error]);

  return <ErrorView reset={reset} />;
}
