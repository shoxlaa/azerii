'use client';

import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import { getDictionary } from '@/i18n';
import { useLocale } from '@/i18n/locale-context';
import { ThemeToggle } from './ThemeToggle';
import { BurgerIcon, CartIcon, CloseIcon, SearchIcon } from './icons';

/** Placeholder cart item count (wired to real cart state later). */
const CART_COUNT = 0;

export function Header() {
  const pathname = usePathname();
  const { locale, toggleLocale } = useLocale();
  const [menuOpen, setMenuOpen] = useState(false);
  const dict = getDictionary(locale);

  const navItems = [
    { href: '/', label: dict.nav.home },
    { href: '/catalog', label: dict.nav.catalog },
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
            width={1024}
            height={1045}
            priority
            className="h-9 w-auto md:h-11 dark:hidden"
          />
          <Image
            src="/logo-light.png"
            alt="AZERII"
            width={1024}
            height={1045}
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
          <button
            onClick={toggleLocale}
            className="font-heading text-sm font-semibold uppercase tracking-wide text-body transition-colors hover:text-accent-text"
            aria-label="Сменить язык"
          >
            {locale === 'ru' ? 'RU' : 'EN'}
            <span className="mx-1 text-body/30">/</span>
            <span className="text-body/50">{locale === 'ru' ? 'EN' : 'RU'}</span>
          </button>

          {/* Theme toggle (inline on tablet+, in the mobile menu on small screens) */}
          <div className="hidden md:flex">
            <ThemeToggle />
          </div>

          <button className="text-body transition-colors hover:text-accent-text" aria-label="Поиск">
            <SearchIcon className="h-5 w-5" />
          </button>

          <button className="relative text-body transition-colors hover:text-accent-text" aria-label="Корзина">
            <CartIcon className="h-6 w-6" />
            {CART_COUNT > 0 && (
              <span className="absolute -right-2 -top-2 flex h-4 min-w-4 items-center justify-center rounded-full bg-accent px-1 text-[10px] font-bold text-cream">
                {CART_COUNT}
              </span>
            )}
          </button>

          {/* Burger (mobile/tablet) */}
          <button
            onClick={() => setMenuOpen((v) => !v)}
            className="text-body transition-colors hover:text-accent-text lg:hidden"
            aria-label="Меню"
            aria-expanded={menuOpen}
          >
            {menuOpen ? <CloseIcon className="h-6 w-6" /> : <BurgerIcon className="h-6 w-6" />}
          </button>
        </div>
      </div>

      {/* Mobile dropdown menu */}
      {menuOpen && (
        <nav className="header-bg border-t border-border lg:hidden">
          <div className="flex flex-col px-6 py-4 md:px-10">
            {navItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setMenuOpen(false)}
                className={`py-3 font-heading text-[16px] uppercase tracking-wide transition-colors hover:text-accent-text ${
                  isActive(item.href) ? 'text-accent-text' : 'text-body'
                }`}
              >
                {item.label}
              </Link>
            ))}
            {/* Theme toggle inside the mobile menu */}
            <div className="mt-3 border-t border-border pt-4 md:hidden">
              <ThemeToggle />
            </div>
          </div>
        </nav>
      )}
    </header>
  );
}
