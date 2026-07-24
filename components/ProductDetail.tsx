'use client';

import { useState } from 'react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import type { Product } from '@/types';
import { getDictionary } from '@/i18n';
import { useLocale } from '@/i18n/locale-context';
import { formatPrice } from '@/lib/format';
import { useCart } from '@/hooks/useCart';
import { Container } from './ui/Container';
import { Button } from './ui/Button';
import { Badge } from './ui/Badge';
import { ProductGallery } from './ProductGallery';

type TabKey = 'description' | 'history' | 'specs';

export function ProductDetail({ product }: { product: Product }) {
  const { locale } = useLocale();
  const dict = getDictionary(locale);
  const t = dict.productPage;

  const name = product.name[locale] || product.name.en;
  const images = product.images.length > 0 ? product.images : [];
  const [tab, setTab] = useState<TabKey>('description');

  const canBuy =
    product.status !== 'out_of_stock' && product.status !== 'in_development';

  const router = useRouter();
  const addItem = useCart((s) => s.addItem);
  const [added, setAdded] = useState(false);

  const cartLine = () => ({
    productId: product.id,
    slug: product.slug,
    name: product.name,
    priceEur: product.priceEur,
    image: images[0],
    scale: product.scale,
  });

  /** "Add to cart" — stay on the page, confirm inline. */
  const handleAddToCart = () => {
    addItem(cartLine());
    setAdded(true);
  };

  /** "Buy" — add and go straight to the cart. */
  const handleBuy = () => {
    addItem(cartLine());
    router.push('/cart');
  };

  return (
    <div className="py-10 md:py-14">
      <Container>
        {/* HERO */}
        <div className="grid gap-8 md:grid-cols-2 md:gap-12">
          {/* Left: image + gallery (hover zoom + fullscreen lightbox) */}
          {images.length > 0 ? (
            <ProductGallery images={images} alt={name} />
          ) : (
            <div
              className="aspect-[4/3] w-full rounded-md border border-border bg-panel"
              style={{ boxShadow: '0 20px 60px rgba(0,0,0,0.5)' }}
            />
          )}

          {/* Right: purchase block */}
          <div className="flex min-w-0 flex-col">
            <div>
              <Badge status={product.status} label={dict.status[product.status]} />
            </div>
            <h1 className="mt-4 font-display text-[42px] font-bold uppercase leading-[0.95] tracking-[1px] text-heading md:text-[52px]">
              {name}
            </h1>
            <p className="mt-3 font-heading text-lg uppercase tracking-wide text-subtle">
              {dict.category[product.category]} · {product.scale}{' '}
              {dict.catalogSection.scaleWord}
            </p>
            <p className="text-price mt-6">{formatPrice(product.priceEur, locale)}</p>

            {canBuy ? (
              <div className="mt-8">
                <div className="flex flex-col gap-3 sm:flex-row">
                  <Button
                    variant="buy"
                    onClick={handleBuy}
                    data-testid="detail-buy"
                    className="w-full sm:w-auto"
                  >
                    {t.buy}
                  </Button>
                  <Button
                    variant="cart"
                    onClick={handleAddToCart}
                    data-testid="detail-add-to-cart"
                    className="w-full sm:w-auto"
                  >
                    {dict.common.addToCart}
                  </Button>
                </div>
                {added ? (
                  <p
                    aria-live="polite"
                    data-testid="added-notice"
                    className="mt-3 font-heading text-sm font-semibold uppercase tracking-wide text-accent-text"
                  >
                    ✓ {dict.cart.title}
                  </p>
                ) : null}
              </div>
            ) : (
              <p className="mt-8 font-heading text-sm font-semibold uppercase tracking-wide text-subtle">
                {t.unavailable}
              </p>
            )}
          </div>
        </div>

        {/* TABS */}
        <div className="mt-14">
          <div className="flex h-[60px] items-stretch gap-6 overflow-x-auto border-b border-border md:gap-8">
            {(['description', 'history', 'specs'] as TabKey[]).map((k) => (
              <button
                key={k}
                type="button"
                onClick={() => setTab(k)}
                aria-current={tab === k}
                className={`relative flex shrink-0 items-center whitespace-nowrap font-heading text-sm font-semibold uppercase tracking-wide transition-colors ${
                  tab === k ? 'text-heading' : 'text-subtle hover:text-heading'
                }`}
              >
                {t.tabs[k]}
                {tab === k ? (
                  <span className="absolute -bottom-px left-0 h-[3px] w-full bg-accent" />
                ) : null}
              </button>
            ))}
          </div>

          <div className="min-h-[400px] bg-panel p-6 text-base leading-relaxed text-body md:p-10">
            {tab === 'description' ? (
              <div>
                <p className="max-w-2xl">
                  {product.description[locale] || t.descriptionFallback}
                </p>
                <ul className="mt-6 space-y-2.5">
                  {t.features.map((f) => (
                    <li key={f} className="flex items-center gap-2.5">
                      <span className="text-accent-text">✓</span>
                      {f}
                    </li>
                  ))}
                </ul>
              </div>
            ) : null}

            {tab === 'history' ? <p className="max-w-2xl">{t.historyText}</p> : null}

            {tab === 'specs' ? (
              <table className="w-full max-w-lg border-collapse overflow-hidden rounded-[4px] border border-border text-left text-sm">
                <thead>
                  <tr className="table-head">
                    <th className="px-4 py-2.5 text-xs font-semibold">{t.specs.param}</th>
                    <th className="px-4 py-2.5 text-xs font-semibold">{t.specs.value}</th>
                  </tr>
                </thead>
                <tbody>
                  <SpecRow label={t.specs.type} value={dict.category[product.category]} />
                  <SpecRow label={t.specs.technology} value={dict.tech[product.tech]} />
                  <SpecRow label={t.specs.scale} value={product.scale} />
                  <SpecRow label={t.specs.status} value={dict.status[product.status]} />
                </tbody>
              </table>
            ) : null}
          </div>
        </div>

        {/* EXTRA block */}
        <div className="mt-16 grid items-center gap-8 md:grid-cols-2 md:gap-12">
          <div>
            <h2 className="font-heading text-[28px] font-bold uppercase tracking-wide text-heading">
              {t.extra.title}
            </h2>
            <p className="mt-4 max-w-xl text-base leading-relaxed text-body">
              {t.extra.text}
            </p>
          </div>
          <div
            className="relative aspect-[4/3] w-full overflow-hidden rounded-md bg-panel"
            style={{ boxShadow: '0 20px 50px rgba(0,0,0,0.35)' }}
          >
            {images[0] ? (
              <Image
                src={images[0]}
                alt=""
                fill
                unoptimized
                sizes="(max-width: 768px) 100vw, 50vw"
                className="object-contain p-3"
              />
            ) : null}
          </div>
        </div>
      </Container>
    </div>
  );
}

function SpecRow({ label, value }: { label: string; value: string }) {
  return (
    <tr className="border-t border-border">
      <td className="px-4 py-2.5 font-heading text-xs font-semibold uppercase tracking-wide text-subtle">
        {label}
      </td>
      <td className="px-4 py-2.5 text-body">{value}</td>
    </tr>
  );
}
