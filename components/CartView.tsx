'use client';

import Image from 'next/image';
import Link from 'next/link';
import type { Product } from '@/types';
import { getDictionary } from '@/i18n';
import { useLocale } from '@/i18n/locale-context';
import { formatPrice, roundMoney } from '@/lib/format';
import { cartTotal, resolveCartItems } from '@/lib/cart';
import { MAX_QTY, MIN_QTY, useCart, useCartHydrated } from '@/hooks/useCart';
import { Container } from './ui/Container';
import { CartIcon, CloseIcon } from './icons';

/** /cart — line items, quantity controls, EUR total, checkout CTA. */
export function CartView({ catalog }: { catalog: Product[] }) {
  const { locale } = useLocale();
  const dict = getDictionary(locale);
  const t = dict.cart;

  const hydrated = useCartHydrated();
  const stored = useCart((s) => s.items);
  const updateQty = useCart((s) => s.updateQty);
  const removeItem = useCart((s) => s.removeItem);

  // Live catalog data wins over the persisted snapshot.
  const items = resolveCartItems(stored, catalog);
  const total = roundMoney(cartTotal(items));
  const count = items.reduce((n, i) => n + i.quantity, 0);

  return (
    <section className="py-12 md:py-16">
      <Container>
        <h1 className="font-heading text-[40px] font-bold uppercase tracking-[1px] text-heading md:text-[56px]">
          {t.title}
        </h1>

        {/* Until the persisted cart is read we render neither list nor empty
            state, so the empty state never flashes for a full cart. */}
        {!hydrated ? (
          <div className="min-h-[320px]" aria-busy="true" />
        ) : items.length === 0 ? (
          <div className="mt-20 mb-10 text-center" data-testid="cart-empty">
            <CartIcon className="mx-auto h-10 w-10 text-subtle opacity-30" />
            <p className="mt-4 font-heading text-xl font-semibold uppercase tracking-wide text-heading">
              {t.empty}
            </p>
            <p className="mt-2 text-subtle">{t.emptyHint}</p>
            <Link
              href="/catalog"
              className="mt-6 inline-flex h-[52px] items-center justify-center rounded-[4px] bg-accent px-6 font-heading text-sm font-semibold uppercase tracking-wide text-cream transition-colors hover:bg-accent-hover"
            >
              {t.browseCatalog}
            </Link>
          </div>
        ) : (
          <>
            <p className="mt-1 text-subtle" data-testid="cart-count-label">
              {count} {t.itemsCount}
            </p>

            <div className="mt-8 grid gap-8 lg:grid-cols-[1fr_340px]">
              {/* Line items */}
              <ul className="flex flex-col gap-4" data-testid="cart-items">
                {items.map((item) => {
                  const name = item.name[locale] || item.name.en;
                  return (
                    <li
                      key={item.productId}
                      data-testid="cart-item"
                      className="flex gap-4 rounded-md border border-border bg-panel p-3 sm:p-4"
                    >
                      <Link
                        href={`/catalog/${item.slug}`}
                        className="relative h-20 w-24 shrink-0 overflow-hidden rounded bg-bg sm:h-24 sm:w-32"
                      >
                        {item.image ? (
                          <Image
                            src={item.image}
                            alt={name}
                            fill
                            unoptimized
                            sizes="128px"
                            className="object-contain p-1"
                          />
                        ) : (
                          // No photo on the product — show a placeholder rather
                          // than an empty box.
                          <span className="flex h-full w-full items-center justify-center text-subtle">
                            <CartIcon className="h-6 w-6 opacity-30" />
                          </span>
                        )}
                      </Link>

                      <div className="flex min-w-0 flex-1 flex-col">
                        <div className="flex items-start justify-between gap-2">
                          <div className="min-w-0">
                            <Link href={`/catalog/${item.slug}`}>
                              <h2 className="truncate font-heading text-base font-semibold uppercase tracking-wide text-heading transition-colors hover:text-accent-text">
                                {name}
                              </h2>
                            </Link>
                            {item.scale ? (
                              <p className="mt-0.5 font-heading text-xs uppercase tracking-wide text-subtle">
                                {item.scale} {dict.catalogSection.scaleWord}
                              </p>
                            ) : null}
                          </div>
                          <button
                            type="button"
                            onClick={() => removeItem(item.productId)}
                            aria-label={`${t.remove}: ${name}`}
                            data-testid="cart-remove"
                            className="shrink-0 text-subtle transition-colors hover:text-accent-text"
                          >
                            <CloseIcon className="h-4 w-4" />
                          </button>
                        </div>

                        <div className="mt-auto flex flex-wrap items-center justify-between gap-3 pt-3">
                          {/* Quantity */}
                          <div
                            className="flex items-center rounded-[4px] border border-border"
                            role="group"
                            aria-label={t.quantity}
                          >
                            <button
                              type="button"
                              onClick={() => updateQty(item.productId, item.quantity - 1)}
                              disabled={item.quantity <= MIN_QTY}
                              aria-label={t.decrease}
                              data-testid="qty-dec"
                              className="flex h-9 w-9 items-center justify-center text-body transition-colors hover:text-accent-text disabled:cursor-not-allowed disabled:opacity-40"
                            >
                              −
                            </button>
                            <span
                              data-testid="qty-value"
                              className="min-w-9 text-center font-heading text-sm font-semibold text-heading"
                            >
                              {item.quantity}
                            </span>
                            <button
                              type="button"
                              onClick={() => updateQty(item.productId, item.quantity + 1)}
                              disabled={item.quantity >= MAX_QTY}
                              aria-label={t.increase}
                              data-testid="qty-inc"
                              className="flex h-9 w-9 items-center justify-center text-body transition-colors hover:text-accent-text disabled:cursor-not-allowed disabled:opacity-40"
                            >
                              +
                            </button>
                          </div>

                          {item.available ? (
                            <span
                              data-testid="line-total"
                              className="font-heading text-lg font-semibold text-accent-text"
                            >
                              {formatPrice(roundMoney(item.priceEur * item.quantity), locale)}
                            </span>
                          ) : (
                            <span
                              data-testid="line-unavailable"
                              className="font-heading text-sm font-semibold uppercase tracking-wide text-subtle"
                            >
                              {t.unavailable}
                            </span>
                          )}
                        </div>
                      </div>
                    </li>
                  );
                })}
              </ul>

              {/* Summary */}
              <aside className="h-fit rounded-md border border-border bg-panel p-5 lg:sticky lg:top-[110px]">
                <div className="flex items-baseline justify-between">
                  <span className="font-heading text-sm font-semibold uppercase tracking-wide text-subtle">
                    {t.total}
                  </span>
                  <span
                    data-testid="cart-total"
                    className="font-heading text-2xl font-semibold text-accent-text"
                  >
                    {formatPrice(total, locale)}
                  </span>
                </div>

                <Link
                  href="/checkout"
                  data-testid="go-checkout"
                  className="mt-5 flex h-[52px] w-full items-center justify-center rounded-[4px] bg-accent px-6 font-heading text-sm font-semibold uppercase tracking-wide text-cream transition-colors hover:bg-accent-hover"
                >
                  {t.checkout}
                </Link>
                <Link
                  href="/catalog"
                  className="mt-3 flex h-[46px] w-full items-center justify-center rounded-[4px] border border-border px-6 font-heading text-sm font-semibold uppercase tracking-wide text-body transition-colors hover:border-accent hover:text-accent-text"
                >
                  {t.continueShopping}
                </Link>
              </aside>
            </div>
          </>
        )}
      </Container>
    </section>
  );
}
