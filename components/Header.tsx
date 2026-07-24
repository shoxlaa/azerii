'use client';

import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import { getDictionary, LOCALES, LOCALE_LABELS } from '@/i18n';
import { LOCALE_SHORT } from '@/i18n/config';
import { useLocale } from '@/i18n/locale-context';
import { useCart, useCartHydrated } from '@/hooks/useCart';
import { ThemeToggle } from './ThemeToggle';
import { HeaderSearch } from './HeaderSearch';
import { CartIcon } from './icons';

export function Header() {
  const pathname = usePathname();
  const { locale, setLocale } = useLocale();
  const dict = getDictionary(locale);

  // Badge stays hidden until the persisted cart is read, so SSR and the first
  // client render agree.
  const cartHydrated = useCartHydrated();
  const cartCount = useCart((s) => s.items.reduce((n, i) => n + i.quantity, 0));

  const navItems = [
    { href: '/', label: dict.nav.home },
    { href: '/catalog', label: dict.nav.catalog },
    { href: '/history', label: dict.nav.history },
    { href: '/museum', label: dict.nav.museum },
    { href: '/gallery', label: dict.nav.gallery },
    { href: '/about', label: dict.nav.about },
    { href: '/contact', label: dict.nav.contact },
  ];

  const isActive = (href: string) =>
    href === '/' ? pathname === '/' : pathname.startsWith(href);

  return (
    <header className="header-bg sticky top-0 z-[1000] w-full">
      <div className="mx-auto flex h-[90px] w-full items-center justify-between px-6 md:px-10 lg:px-20">
        {/* Logo — dark theme shows the light (cream) mark, light theme the dark (black) mark */}
        <Link href="/" className="flex items-center" aria-label="AZERII — на главную">
          <Image
            src="/logo-dark.png"
            alt="AZERII"
            /* The mark renders ~43px wide. width/height only carry the aspect
               ratio and drive the srcset Next builds as [width, width*2], so
               the old 1024 made a 40px logo fetch a 2048px variant. */
            width={110}
            height={112}
            priority
            className="h-9 w-auto md:h-11 dark:hidden"
          />
          <Image
            src="/logo-light.png"
            alt="AZERII"
            /* The mark renders ~43px wide. width/height only carry the aspect
               ratio and drive the srcset Next builds as [width, width*2], so
               the old 1024 made a 40px logo fetch a 2048px variant. */
            width={110}
            height={112}
            priority
            className="hidden h-9 w-auto md:h-11 dark:block"
          />
        </Link>

        {/* Desktop nav */}
        <nav className="hidden items-center gap-10 lg:flex">
          {navItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={`font-heading text-[16px] uppercase tracking-wide underline-offset-8 transition-colors hover:text-accent-text hover:underline ${
                isActive(item.href) ? 'text-accent-text' : 'text-body'
              }`}
            >
              {item.label}
            </Link>
          ))}
        </nav>

        {/* Right actions */}
        <div className="flex items-center gap-4 md:gap-5">
          {/* Every locale is its own button: with three of them, the old
              "active / other" pair no longer describes the choice. */}
          <div className="flex items-center font-heading text-sm font-semibold uppercase tracking-wide">
            {LOCALES.map((code, i) => (
              <span key={code} className="flex items-center">
                {i > 0 ? <span className="mx-1 text-body/30">/</span> : null}
                <button
                  type="button"
                  onClick={() => setLocale(code)}
                  aria-label={LOCALE_LABELS[code]}
                  aria-current={code === locale}
                  className={`transition-colors hover:text-accent-text ${
                    code === locale ? 'text-body' : 'text-body/50'
                  }`}
                >
                  {LOCALE_SHORT[code]}
                </button>
              </span>
            ))}
          </div>

          {/* Theme toggle — always in the header now that the burger menu is gone */}
          <ThemeToggle />

          <HeaderSearch />

          <Link
            href="/cart"
            className="relative text-body transition-colors hover:text-accent-text"
            aria-label={dict.cart.title}
            data-testid="cart-link"
          >
            <CartIcon className="h-6 w-6" />
            {cartHydrated && cartCount > 0 && (
              <span
                data-testid="cart-count"
                className="absolute -right-2 -top-2 flex h-4 min-w-4 items-center justify-center rounded-full bg-accent px-1 text-[10px] font-bold text-cream"
              >
                {cartCount}
              </span>
            )}
          </Link>
        </div>
      </div>
    </header>
  );
}
