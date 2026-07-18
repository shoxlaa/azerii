'use client';

import { useState, useTransition } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import type { Product, ShippingMethod } from '@/types';
import { getDictionary } from '@/i18n';
import { useLocale } from '@/i18n/locale-context';
import { formatPrice, roundMoney } from '@/lib/format';
import { cartTotal, resolveCartItems } from '@/lib/cart';
import { useCart, useCartHydrated } from '@/hooks/useCart';
import { validateCheckout, isValid, type CheckoutErrors, type CheckoutInput } from '@/lib/checkout';
import { submitOrder } from '@/server/order-actions';
import { Container } from './ui/Container';
import { CartIcon } from './icons';

const EMPTY: CheckoutInput = {
  name: '',
  email: '',
  phone: '',
  country: '',
  city: '',
  address: '',
  postalCode: '',
  shipping: 'standard',
  comment: '',
};

/** /checkout — contact + delivery form, order summary, submit. */
export function CheckoutForm({ catalog }: { catalog: Product[] }) {
  const router = useRouter();
  const { locale } = useLocale();
  const dict = getDictionary(locale);
  const t = dict.checkout;

  const hydrated = useCartHydrated();
  const stored = useCart((s) => s.items);
  const clear = useCart((s) => s.clear);

  // Live catalog data, so the summary matches what the server will charge.
  // Unavailable lines are excluded — the order action drops them too.
  const items = resolveCartItems(stored, catalog).filter((i) => i.available);
  const total = roundMoney(cartTotal(items));

  const [fields, setFields] = useState<CheckoutInput>(EMPTY);
  const [honeypot, setHoneypot] = useState('');
  const [errors, setErrors] = useState<CheckoutErrors>({});
  const [formError, setFormError] = useState<string | null>(null);
  const [pending, startTransition] = useTransition();

  const set = <K extends keyof CheckoutInput>(key: K, value: CheckoutInput[K]) => {
    setFields((f) => ({ ...f, [key]: value }));
    setErrors((e) => ({ ...e, [key]: undefined }));
  };

  const shippingOptions: { value: ShippingMethod; label: string }[] = [
    { value: 'standard', label: t.shippingStandard },
    { value: 'express', label: t.shippingExpress },
    { value: 'pickup', label: t.shippingPickup },
  ];

  const needsAddress = fields.shipping !== 'pickup';

  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setFormError(null);

    const found = validateCheckout(fields);
    if (!isValid(found)) {
      setErrors(found);
      return;
    }
    if (items.length === 0) {
      setFormError(t.errors.cart);
      return;
    }

    startTransition(async () => {
      const result = await submitOrder({
        customer: fields,
        items: items.map((i) => ({ slug: i.slug, quantity: i.quantity })),
        locale,
        company: honeypot,
      });

      if (result.ok) {
        clear();
        router.push(`/checkout/success?order=${encodeURIComponent(result.orderId)}`);
        return;
      }
      if ('errors' in result) {
        setErrors(result.errors);
        return;
      }
      setFormError(result.error === 'cart' ? t.errors.cart : t.errors.generic);
    });
  };

  // Empty cart → nothing to check out.
  if (hydrated && items.length === 0) {
    return (
      <section className="py-12 md:py-16">
        <Container>
          <h1 className="font-heading text-[40px] font-bold uppercase tracking-[1px] text-heading md:text-[56px]">
            {t.title}
          </h1>
          <div className="mt-20 mb-10 text-center" data-testid="checkout-empty">
            <CartIcon className="mx-auto h-10 w-10 text-subtle opacity-30" />
            <p className="mt-4 font-heading text-xl font-semibold uppercase tracking-wide text-heading">
              {t.emptyTitle}
            </p>
            <p className="mt-2 text-subtle">{t.emptyHint}</p>
            <Link
              href="/catalog"
              className="mt-6 inline-flex h-[52px] items-center justify-center rounded-[4px] bg-accent px-6 font-heading text-sm font-semibold uppercase tracking-wide text-cream transition-colors hover:bg-accent-hover"
            >
              {dict.cart.browseCatalog}
            </Link>
          </div>
        </Container>
      </section>
    );
  }

  return (
    <section className="py-12 md:py-16">
      <Container>
        <h1 className="font-heading text-[40px] font-bold uppercase tracking-[1px] text-heading md:text-[56px]">
          {t.title}
        </h1>

        <form onSubmit={onSubmit} noValidate className="mt-8 grid gap-8 lg:grid-cols-[1fr_340px]">
          <div className="flex flex-col gap-8">
            {/* Contact */}
            <fieldset className="rounded-md border border-border bg-panel p-5">
              <legend className="px-2 font-heading text-sm font-semibold uppercase tracking-wide text-subtle">
                {t.contactSection}
              </legend>
              <div className="grid gap-4 sm:grid-cols-2">
                <Field
                  id="name"
                  label={t.name}
                  value={fields.name}
                  onChange={(v) => set('name', v)}
                  error={errors.name && t.errors[errors.name]}
                  autoComplete="name"
                  className="sm:col-span-2"
                />
                <Field
                  id="email"
                  type="email"
                  label={t.email}
                  value={fields.email}
                  onChange={(v) => set('email', v)}
                  error={errors.email && t.errors[errors.email]}
                  autoComplete="email"
                />
                <Field
                  id="phone"
                  type="tel"
                  label={t.phone}
                  value={fields.phone}
                  onChange={(v) => set('phone', v)}
                  error={errors.phone && t.errors[errors.phone]}
                  autoComplete="tel"
                />
              </div>
            </fieldset>

            {/* Delivery */}
            <fieldset className="rounded-md border border-border bg-panel p-5">
              <legend className="px-2 font-heading text-sm font-semibold uppercase tracking-wide text-subtle">
                {t.deliverySection}
              </legend>

              <label className="block">
                <span className="mb-1.5 block font-heading text-xs font-semibold uppercase tracking-wide text-subtle">
                  {t.shipping}
                </span>
                <select
                  id="shipping"
                  data-testid="field-shipping"
                  value={fields.shipping}
                  onChange={(e) => set('shipping', e.target.value as ShippingMethod)}
                  className="w-full rounded-[4px] border border-border bg-bg px-3 py-2.5 font-body text-sm text-body outline-none focus:border-accent"
                >
                  {shippingOptions.map((o) => (
                    <option key={o.value} value={o.value}>
                      {o.label}
                    </option>
                  ))}
                </select>
              </label>

              {needsAddress ? (
                <div className="mt-4 grid gap-4 sm:grid-cols-2">
                  <Field
                    id="country"
                    label={t.country}
                    value={fields.country}
                    onChange={(v) => set('country', v)}
                    error={errors.country && t.errors[errors.country]}
                    autoComplete="country-name"
                  />
                  <Field
                    id="city"
                    label={t.city}
                    value={fields.city}
                    onChange={(v) => set('city', v)}
                    error={errors.city && t.errors[errors.city]}
                    autoComplete="address-level2"
                  />
                  <Field
                    id="address"
                    label={t.address}
                    value={fields.address}
                    onChange={(v) => set('address', v)}
                    error={errors.address && t.errors[errors.address]}
                    autoComplete="street-address"
                    className="sm:col-span-2"
                  />
                  <Field
                    id="postalCode"
                    label={t.postalCode}
                    value={fields.postalCode}
                    onChange={(v) => set('postalCode', v)}
                    error={errors.postalCode && t.errors[errors.postalCode]}
                    autoComplete="postal-code"
                  />
                </div>
              ) : null}

              <label className="mt-4 block">
                <span className="mb-1.5 block font-heading text-xs font-semibold uppercase tracking-wide text-subtle">
                  {t.comment}
                </span>
                <textarea
                  id="comment"
                  data-testid="field-comment"
                  rows={3}
                  value={fields.comment}
                  onChange={(e) => set('comment', e.target.value)}
                  placeholder={t.commentPlaceholder}
                  className="w-full rounded-[4px] border border-border bg-bg px-3 py-2.5 font-body text-sm text-body outline-none placeholder:text-subtle focus:border-accent"
                />
              </label>

              {/* Honeypot — hidden from users, catches bots. */}
              <div aria-hidden className="absolute left-[-9999px] top-auto h-px w-px overflow-hidden">
                <label>
                  Company
                  <input
                    type="text"
                    name="company"
                    tabIndex={-1}
                    autoComplete="off"
                    value={honeypot}
                    onChange={(e) => setHoneypot(e.target.value)}
                  />
                </label>
              </div>
            </fieldset>
          </div>

          {/* Summary */}
          <aside className="h-fit rounded-md border border-border bg-panel p-5 lg:sticky lg:top-[110px]">
            <h2 className="font-heading text-sm font-semibold uppercase tracking-wide text-subtle">
              {t.summary}
            </h2>
            <ul className="mt-4 flex flex-col gap-2.5">
              {items.map((i) => (
                <li key={i.productId} className="flex justify-between gap-3 text-sm">
                  <span className="min-w-0 truncate text-body">
                    {(i.name[locale] || i.name.en)} × {i.quantity}
                  </span>
                  <span className="shrink-0 text-body">
                    {formatPrice(i.priceEur * i.quantity, locale)}
                  </span>
                </li>
              ))}
            </ul>

            <div className="mt-4 flex items-baseline justify-between border-t border-border pt-4">
              <span className="font-heading text-sm font-semibold uppercase tracking-wide text-subtle">
                {t.total}
              </span>
              <span
                data-testid="checkout-total"
                className="font-heading text-2xl font-semibold text-accent-text"
              >
                {formatPrice(total, locale)}
              </span>
            </div>

            {formError ? (
              <p role="alert" data-testid="form-error" className="mt-4 text-sm text-red-500">
                {formError}
              </p>
            ) : null}

            <button
              type="submit"
              disabled={pending}
              data-testid="submit-order"
              className="mt-5 flex h-[52px] w-full items-center justify-center rounded-[4px] bg-accent px-6 font-heading text-sm font-semibold uppercase tracking-wide text-cream transition-colors hover:bg-accent-hover disabled:cursor-not-allowed disabled:opacity-60"
            >
              {pending ? t.submitting : t.submit}
            </button>

            <p className="mt-4 text-xs leading-relaxed text-subtle">{t.paymentNote}</p>
          </aside>
        </form>
      </Container>
    </section>
  );
}

function Field({
  id,
  label,
  value,
  onChange,
  error,
  type = 'text',
  autoComplete,
  className = '',
}: {
  id: string;
  label: string;
  value: string;
  onChange: (value: string) => void;
  error?: string;
  type?: string;
  autoComplete?: string;
  className?: string;
}) {
  return (
    <label className={`block ${className}`}>
      <span className="mb-1.5 block font-heading text-xs font-semibold uppercase tracking-wide text-subtle">
        {label}
      </span>
      <input
        id={id}
        data-testid={`field-${id}`}
        type={type}
        value={value}
        autoComplete={autoComplete}
        aria-invalid={Boolean(error)}
        aria-describedby={error ? `${id}-error` : undefined}
        onChange={(e) => onChange(e.target.value)}
        className={`w-full rounded-[4px] border bg-bg px-3 py-2.5 font-body text-sm text-body outline-none focus:border-accent ${
          error ? 'border-red-500' : 'border-border'
        }`}
      />
      {error ? (
        <span id={`${id}-error`} data-testid={`error-${id}`} className="mt-1 block text-xs text-red-500">
          {error}
        </span>
      ) : null}
    </label>
  );
}
