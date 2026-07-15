'use client';

import { useState } from 'react';
import Image from 'next/image';
import type { Product } from '@/types';
import { getDictionary } from '@/i18n';
import { useLocale } from '@/i18n/locale-context';
import { formatPrice } from '@/lib/format';
import { Container } from './ui/Container';
import { Button } from './ui/Button';
import { Badge } from './ui/Badge';

type TabKey = 'description' | 'history' | 'specs';

export function ProductDetail({ product }: { product: Product }) {
  const { locale } = useLocale();
  const dict = getDictionary(locale);
  const t = dict.productPage;

  const name = product.name[locale] || product.name.en;
  const images = product.images.length > 0 ? product.images : [];
  const [active, setActive] = useState(0);
  const [tab, setTab] = useState<TabKey>('description');

  const canBuy =
    product.status !== 'out_of_stock' && product.status !== 'in_development';
  const mainImage = images[active];

  // TODO: wire to a real cart hook (useCart) in the next step.
  const handleCart = () => {};

  return (
    <div className="py-10 md:py-14">
      <Container>
        {/* HERO */}
        <div className="grid gap-8 md:grid-cols-2 md:gap-12">
          {/* Left: image + gallery */}
          <div className="min-w-0">
            <div
              className="group relative h-[340px] overflow-hidden rounded-md border border-border bg-panel sm:h-[440px] md:h-[520px]"
              style={{ boxShadow: '0 20px 60px rgba(0,0,0,0.5)' }}
            >
              {mainImage ? (
                <Image
                  src={mainImage}
                  alt={name}
                  fill
                  priority
                  sizes="(max-width: 768px) 100vw, 50vw"
                  className="object-cover transition-transform duration-300 group-hover:scale-[1.03]"
                />
              ) : null}
            </div>

            {images.length > 1 ? (
              <div className="mt-5 flex gap-5 overflow-x-auto pb-1">
                {images.slice(0, 5).map((img, i) => (
                  <button
                    key={img + i}
                    type="button"
                    onClick={() => setActive(i)}
                    aria-label={`${name} — ${i + 1}`}
                    aria-current={i === active}
                    className={`relative h-[110px] w-[180px] shrink-0 overflow-hidden rounded-[4px] border-2 transition ${
                      i === active
                        ? 'border-gold'
                        : 'border-transparent hover:brightness-110'
                    }`}
                  >
                    <Image src={img} alt="" fill sizes="180px" className="object-cover" />
                  </button>
                ))}
              </div>
            ) : null}
          </div>

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
              <div className="mt-8 flex flex-col gap-3 sm:flex-row">
                <Button variant="buy" onClick={handleCart} className="w-full sm:w-auto">
                  {t.buy}
                </Button>
                <Button variant="cart" onClick={handleCart} className="w-full sm:w-auto">
                  {dict.common.addToCart}
                </Button>
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
                  <span className="absolute -bottom-px left-0 h-[3px] w-full bg-gold" />
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
                      <span className="text-gold">✓</span>
                      {f}
                    </li>
                  ))}
                </ul>
              </div>
            ) : null}

            {tab === 'history' ? <p className="max-w-2xl">{t.historyText}</p> : null}

            {tab === 'specs' ? (
              <dl className="grid max-w-md grid-cols-[auto_1fr] gap-x-10 gap-y-3.5">
                <SpecRow label={t.specs.type} value={dict.category[product.category]} />
                <SpecRow label={t.specs.technology} value={dict.tech[product.tech]} />
                <SpecRow label={t.specs.scale} value={product.scale} />
                <SpecRow label={t.specs.status} value={dict.status[product.status]} />
              </dl>
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
            className="relative h-[280px] overflow-hidden rounded-md sm:h-[340px]"
            style={{ boxShadow: '0 20px 50px rgba(0,0,0,0.35)' }}
          >
            {images[0] ? (
              <Image
                src={images[0]}
                alt=""
                fill
                sizes="(max-width: 768px) 100vw, 50vw"
                className="object-cover"
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
    <>
      <dt className="font-heading text-sm font-semibold uppercase tracking-wide text-subtle">
        {label}
      </dt>
      <dd className="text-body">{value}</dd>
    </>
  );
}
