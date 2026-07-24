'use client';

/**
 * MobileBottomNav — fixed bottom navigation for phones and tablets (< xl).
 *
 * Replaces the burger menu below xl, where the desktop header nav (xl:flex)
 * takes over. Five destinations, each an icon over a caption, colour-only
 * transitions. The cart entry carries the live item count from the same
 * Zustand store the header badge reads.
 */

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { getDictionary } from '@/i18n';
import { useLocale } from '@/i18n/locale-context';
import { useCart, useCartHydrated } from '@/hooks/useCart';
import { CartIcon, CatalogIcon, GalleryIcon, HomeIcon, MuseumIcon } from './icons';

export function MobileBottomNav() {
  const pathname = usePathname();
  const { locale } = useLocale();
  const t = getDictionary(locale).mobileNav;

  // Same store as the header cart badge; the count stays hidden until the
  // persisted cart has hydrated so SSR and the first client render agree.
  const cartHydrated = useCartHydrated();
  const cartCount = useCart((s) => s.items.reduce((n, i) => n + i.quantity, 0));

  const items = [
    { href: '/', label: t.home, Icon: HomeIcon },
    { href: '/catalog', label: t.catalog, Icon: CatalogIcon },
    { href: '/museum', label: t.museum, Icon: MuseumIcon },
    { href: '/gallery', label: t.gallery, Icon: GalleryIcon },
    { href: '/cart', label: t.cart, Icon: CartIcon },
  ];

  // Home matches only the root; every other tab matches its whole subtree.
  const isActive = (href: string) =>
    href === '/' ? pathname === '/' : pathname.startsWith(href);

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 border-t border-border bg-panel pb-[env(safe-area-inset-bottom)] xl:hidden">
      <ul className="grid grid-cols-5">
        {items.map(({ href, label, Icon }) => {
          const active = isActive(href);
          const showBadge = href === '/cart' && cartHydrated && cartCount > 0;

          return (
            <li key={href}>
              <Link
                href={href}
                aria-current={active ? 'page' : undefined}
                className={`flex min-h-[56px] flex-col items-center justify-center gap-1 transition-colors ${
                  active ? 'text-accent-text' : 'text-subtle hover:text-accent-text'
                }`}
              >
                <span className="relative">
                  <Icon className="h-6 w-6" />
                  {showBadge && (
                    <span
                      data-testid="mobile-cart-count"
                      className="absolute -right-2 -top-2 flex h-4 min-w-4 items-center justify-center rounded-full bg-accent px-1 font-heading text-[10px] text-cream"
                    >
                      {cartCount}
                    </span>
                  )}
                </span>
                <span className="font-heading text-[10px] uppercase tracking-wide">
                  {label}
                </span>
              </Link>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
