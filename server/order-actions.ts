'use server';

/**
 * Server Action for placing an order.
 *
 * A Server Action is reachable by any POST, not just via our form, so this
 * treats its input as untrusted:
 *   - fields are re-validated server-side (the client form's validation is UX);
 *   - prices are re-read from the catalog and never taken from the client, so
 *     a tampered cart cannot set its own price;
 *   - non-purchasable products (out_of_stock / in_development) are dropped;
 *   - a honeypot field silently absorbs bot submissions.
 */

import type { Customer, Locale, OrderItem } from '@/types';
import { getProducts } from '@/lib/data';
import { SAMPLE_PRODUCTS } from '@/constants/sampleProducts';
import { validateCheckout, isValid, type CheckoutErrors, type CheckoutInput } from '@/lib/checkout';
import { createOrder } from './orders';

const MIN_QTY = 1;
const MAX_QTY = 99;

export interface SubmitOrderInput {
  customer: CheckoutInput;
  /** Only slug + quantity — the server resolves the real price. */
  items: { slug: string; quantity: number }[];
  locale: Locale;
  /** Honeypot: must stay empty. Real users never see this field. */
  company?: string;
}

export type SubmitOrderResult =
  | { ok: true; orderId: string }
  | { ok: false; errors: CheckoutErrors }
  | { ok: false; error: 'cart' | 'generic' };

export async function submitOrder(input: SubmitOrderInput): Promise<SubmitOrderResult> {
  try {
    // Honeypot tripped → looks like a bot. Report success without doing
    // anything, so the bot learns nothing from the response.
    if (input.company && input.company.trim().length > 0) {
      console.warn('[orders] honeypot triggered — dropping submission');
      return { ok: true, orderId: 'AZ-DISCARDED' };
    }

    const errors = validateCheckout(input.customer ?? {});
    if (!isValid(errors)) return { ok: false, errors };

    if (!Array.isArray(input.items) || input.items.length === 0) {
      return { ok: false, error: 'cart' };
    }

    // Authoritative catalog: real products, else the demo fallback.
    const products = await getProducts();
    const catalog = products.length > 0 ? products : SAMPLE_PRODUCTS;

    const items: OrderItem[] = [];
    for (const line of input.items) {
      const product = catalog.find((p) => p.slug === line.slug);
      if (!product) continue;
      // Mirror the storefront rule: these can't be purchased.
      if (product.status === 'out_of_stock' || product.status === 'in_development') continue;

      const quantity = Math.min(MAX_QTY, Math.max(MIN_QTY, Math.round(line.quantity)));
      items.push({
        productId: product.id,
        name: product.name,
        unitPriceEur: product.priceEur, // price comes from the catalog, not the client
        quantity,
      });
    }

    if (items.length === 0) return { ok: false, error: 'cart' };

    const f = input.customer;
    const customer: Customer = {
      name: f.name.trim(),
      email: f.email.trim(),
      phone: f.phone.trim(),
      country: f.country?.trim() ?? '',
      city: f.city?.trim() ?? '',
      address: f.address?.trim() ?? '',
      postalCode: f.postalCode?.trim() ?? '',
    };

    const order = await createOrder({
      items,
      customer,
      shipping: f.shipping,
      locale: input.locale,
      comment: f.comment?.trim() || undefined,
    });

    return { ok: true, orderId: order.id };
  } catch (err) {
    console.error('[orders] submitOrder failed:', err);
    return { ok: false, error: 'generic' };
  }
}
