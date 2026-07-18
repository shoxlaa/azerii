'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import type { CategoryType, Localized } from '@/types';
import { getDictionary } from '@/i18n';
import { useLocale } from '@/i18n/locale-context';
import { formatPrice } from '@/lib/format';
import { SearchIcon, CloseIcon } from './icons';

/** Trimmed product shape returned by /search/suggest. */
interface Suggestion {
  id: string;
  slug: string;
  name: Localized;
  category: CategoryType;
  priceEur: number;
  image: string | null;
}

/** Header search: icon toggles an overlay with a live-suggestion dropdown. */
export function HeaderSearch() {
  const router = useRouter();
  const { locale } = useLocale();
  const dict = getDictionary(locale);
  const t = dict.searchBox;

  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<Suggestion[]>([]);
  const [loading, setLoading] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  const close = useCallback(() => {
    setOpen(false);
    setQuery('');
    setResults([]);
    setLoading(false);
  }, []);

  // Focus the field when the overlay opens.
  useEffect(() => {
    if (open) inputRef.current?.focus();
  }, [open]);

  // Reset the field to a clean state as the user edits. Kept out of the fetch
  // effect so that effect never calls setState synchronously.
  const onQueryChange = useCallback((value: string) => {
    setQuery(value);
    if (value.trim()) {
      setLoading(true);
    } else {
      setResults([]);
      setLoading(false);
    }
  }, []);

  // Debounced live suggestions. The synchronous empty/loading transitions live
  // in onQueryChange, so this effect only sets state inside the deferred fetch.
  useEffect(() => {
    const q = query.trim();
    if (!q) return;
    const ctrl = new AbortController();
    const id = setTimeout(() => {
      fetch(`/search/suggest?q=${encodeURIComponent(q)}`, { signal: ctrl.signal })
        .then((res) => res.json())
        .then((data: { results: Suggestion[] }) => {
          setResults(data.results ?? []);
          setLoading(false);
        })
        .catch(() => {
          /* aborted or failed — leave prior results, drop loading state */
          if (!ctrl.signal.aborted) setLoading(false);
        });
    }, 250);
    return () => {
      clearTimeout(id);
      ctrl.abort();
    };
  }, [query]);

  // Close on outside click / Escape.
  useEffect(() => {
    if (!open) return;
    const onClick = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) close();
    };
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') close();
    };
    document.addEventListener('mousedown', onClick);
    document.addEventListener('keydown', onKey);
    return () => {
      document.removeEventListener('mousedown', onClick);
      document.removeEventListener('keydown', onKey);
    };
  }, [open, close]);

  /** Go to the full results page. */
  const goToResults = useCallback(() => {
    const q = query.trim();
    if (!q) return;
    router.push(`/search?q=${encodeURIComponent(q)}`);
    close();
  }, [query, router, close]);

  /** Go straight to a product card. */
  const goToProduct = useCallback(
    (slug: string) => {
      router.push(`/catalog/${slug}`);
      close();
    },
    [router, close],
  );

  const hasQuery = query.trim().length > 0;

  return (
    <div ref={containerRef} className="relative flex items-center">
      <button
        type="button"
        onClick={() => (open ? close() : setOpen(true))}
        className="text-body transition-colors hover:text-accent-text"
        aria-label={t.open}
        aria-expanded={open}
      >
        <SearchIcon className="h-5 w-5" />
      </button>

      {open && (
        <div className="absolute right-0 top-[calc(100%+18px)] z-[1100] w-[calc(100vw-2rem)] max-w-sm rounded-md border border-border bg-panel shadow-lg sm:w-96">
          <form
            onSubmit={(e) => {
              e.preventDefault();
              goToResults();
            }}
            className="flex items-center gap-2 border-b border-border px-3 py-2.5"
          >
            <SearchIcon className="h-4 w-4 shrink-0 text-subtle" />
            <input
              ref={inputRef}
              type="search"
              value={query}
              onChange={(e) => onQueryChange(e.target.value)}
              placeholder={t.placeholder}
              aria-label={t.placeholder}
              className="w-full bg-transparent font-body text-sm text-body outline-none placeholder:text-subtle"
            />
            <button
              type="button"
              onClick={close}
              aria-label={t.close}
              className="shrink-0 text-subtle transition-colors hover:text-accent-text"
            >
              <CloseIcon className="h-4 w-4" />
            </button>
          </form>

          {hasQuery && (
            <div className="max-h-[60vh] overflow-y-auto py-1">
              {loading && results.length === 0 ? (
                <p className="px-4 py-3 text-sm text-subtle">{t.loading}</p>
              ) : results.length === 0 ? (
                <p className="px-4 py-3 text-sm text-subtle">{t.noResults}</p>
              ) : (
                <ul>
                  {results.map((r) => {
                    const name = r.name[locale] || r.name.en;
                    return (
                      <li key={r.id}>
                        <button
                          type="button"
                          onClick={() => goToProduct(r.slug)}
                          className="flex w-full items-center gap-3 px-3 py-2 text-left transition-colors hover:bg-black/5 dark:hover:bg-white/5"
                        >
                          <span className="relative h-10 w-12 shrink-0 overflow-hidden rounded bg-bg">
                            {r.image ? (
                              <Image src={r.image} alt={name} fill sizes="48px" className="object-contain" />
                            ) : null}
                          </span>
                          <span className="min-w-0 flex-1">
                            <span className="block truncate font-heading text-sm font-semibold uppercase tracking-wide text-heading">
                              {name}
                            </span>
                            <span className="block text-xs text-subtle">{dict.category[r.category]}</span>
                          </span>
                          <span className="shrink-0 font-heading text-sm text-accent-text">
                            {formatPrice(r.priceEur, locale)}
                          </span>
                        </button>
                      </li>
                    );
                  })}
                  <li className="border-t border-border">
                    <button
                      type="button"
                      onClick={goToResults}
                      className="w-full px-4 py-2.5 text-left font-heading text-xs font-semibold uppercase tracking-wide text-accent-text transition-colors hover:underline"
                    >
                      {t.viewAll}
                    </button>
                  </li>
                </ul>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
