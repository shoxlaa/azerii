import 'server-only';

/**
 * Order handling (server-only).
 *
 * Builds the Order, records it, and emails both the seller and the buyer.
 * Online payment is intentionally not part of this flow — an order is taken
 * as a *request*, and payment (Stripe/PayPal) is a later step.
 *
 * Orders are stored in the `orders` collection and both parties are notified.
 * Storage is required; notification is best-effort.
 */

import { getPayload } from 'payload';
import config from '@payload-config';
import type { Locale, Order, OrderItem, Customer, ShippingMethod } from '@/types';
import { roundMoney } from '@/lib/format';
import { sendMail } from './mail';

/** Where seller notifications go. */
const SELLER_EMAIL = process.env.ORDER_NOTIFY_EMAIL || 'info@azerii.example';

export interface CreateOrderInput {
  items: OrderItem[];
  customer: Customer;
  shipping: ShippingMethod;
  locale: Locale;
  comment?: string;
}

/** Sum all line items into a total, in EUR. */
function computeTotal(items: OrderItem[]): number {
  return roundMoney(items.reduce((sum, i) => sum + i.unitPriceEur * i.quantity, 0));
}

/** Short, human-quotable order id, e.g. "AZ-M3K2J1-7F2A". */
function generateOrderId(): string {
  const stamp = Date.now().toString(36).toUpperCase();
  const rand = Math.random().toString(36).slice(2, 6).toUpperCase();
  return `AZ-${stamp}-${rand}`;
}

/** Format an EUR amount as a plain string for e-mail bodies, e.g. "499.99 EUR". */
function money(amount: number): string {
  return `${amount.toFixed(2)} EUR`;
}

/** Plain-text line-item table shared by both e-mails. */
function itemLines(order: Order): string {
  return order.items
    .map(
      (i) =>
        `  - ${i.name.en} × ${i.quantity} — ${money(i.unitPriceEur * i.quantity)}`,
    )
    .join('\n');
}

/** Internal notification for the seller. */
function sellerEmail(order: Order): { subject: string; body: string } {
  const c = order.customer;
  return {
    subject: `New order ${order.id} — ${money(order.totalEur)}`,
    body: [
      `New order request: ${order.id}`,
      `Placed: ${order.createdAt}`,
      `Locale: ${order.locale}`,
      '',
      'Items:',
      itemLines(order),
      '',
      `Total: ${money(order.totalEur)}`,
      `Shipping: ${order.shipping}`,
      '',
      'Customer:',
      `  Name:  ${c.name}`,
      `  Email: ${c.email}`,
      `  Phone: ${c.phone ?? '—'}`,
      order.shipping === 'pickup'
        ? '  Address: (pickup in Baku)'
        : `  Address: ${c.address}, ${c.city}, ${c.postalCode}, ${c.country}`,
      '',
      `Comment: ${order.comment?.trim() || '—'}`,
      '',
      'Payment is not collected online — contact the customer to arrange it.',
    ].join('\n'),
  };
}

/** Confirmation for the buyer, in the locale they ordered in. */
function buyerEmail(order: Order): { subject: string; body: string } {
  const ru = order.locale === 'ru';
  return {
    subject: ru
      ? `AZERII — заказ ${order.id} принят`
      : `AZERII — order ${order.id} received`,
    body: ru
      ? [
          `Здравствуйте, ${order.customer.name}!`,
          '',
          `Спасибо за заказ. Мы получили вашу заявку № ${order.id}.`,
          '',
          'Состав заказа:',
          itemLines(order),
          '',
          `Итого: ${money(order.totalEur)}`,
          '',
          'Онлайн-оплата пока недоступна — мы свяжемся с вами, чтобы подтвердить заказ и договориться об оплате и доставке.',
          '',
          'С уважением, команда AZERII',
        ].join('\n')
      : [
          `Hello ${order.customer.name},`,
          '',
          `Thank you for your order. We have received your request ${order.id}.`,
          '',
          'Your order:',
          itemLines(order),
          '',
          `Total: ${money(order.totalEur)}`,
          '',
          'Online payment is not available yet — we will contact you to confirm the order and arrange payment and delivery.',
          '',
          'The AZERII team',
        ].join('\n'),
  };
}

/** One-line postal address, or a note that the customer collects in person. */
function formatAddress(order: Order): string {
  if (order.shipping === 'pickup') return 'Самовывоз (Баку)';
  const c = order.customer;
  return [c.country, c.city, c.address, c.postalCode].filter(Boolean).join(', ');
}

/**
 * Persist the order so it appears in the admin.
 *
 * Writes through the Local API, which bypasses the collection's `create:
 * authed` rule — that rule exists to close the public REST endpoint, not to
 * block checkout. Throws on failure: an order we cannot store must not be
 * reported to the customer as accepted.
 */
async function recordOrder(order: Order): Promise<void> {
  const payload = await getPayload({ config });

  await payload.create({
    collection: 'orders',
    data: {
      orderNumber: order.id,
      status: order.status,
      total: order.totalEur,
      shipping: order.shipping,
      orderLocale: order.locale,
      // Snapshot of what was bought, at the price charged.
      items: order.items.map((i) => ({
        name: i.name.en,
        nameRu: i.name.ru,
        quantity: i.quantity,
        unitPriceEur: i.unitPriceEur,
        lineTotalEur: Number((i.unitPriceEur * i.quantity).toFixed(2)),
      })),
      customerName: order.customer.name,
      customerEmail: order.customer.email,
      customerPhone: order.customer.phone,
      customerAddress: formatAddress(order),
      comment: order.comment,
    },
  });

  console.info('[orders] stored', order.id, `${money(order.totalEur)}`);
}

/**
 * Attach the notification outcome to the stored order.
 *
 * Deliberately swallows its own failure: the order and the e-mails already
 * happened, and losing the audit note must not turn a completed checkout into
 * an error.
 */
async function markNotifyStatus(orderNumber: string, status: string): Promise<void> {
  try {
    const payload = await getPayload({ config });
    const { docs } = await payload.find({
      collection: 'orders',
      where: { orderNumber: { equals: orderNumber } },
      limit: 1,
      depth: 0,
    });
    const doc = docs[0] as { id: string | number } | undefined;
    if (doc) {
      await payload.update({
        collection: 'orders',
        id: doc.id as string,
        data: { notifyStatus: status },
      });
    }
  } catch (err) {
    console.error('[orders] could not record notification status:', err);
  }
}

/**
 * Create an order: record it, then notify seller and buyer.
 * Callers must pass authoritative prices (see `submitOrder`).
 */
export async function createOrder(input: CreateOrderInput): Promise<Order> {
  const now = new Date().toISOString();
  const order: Order = {
    id: generateOrderId(),
    items: input.items,
    customer: input.customer,
    status: 'pending',
    totalEur: computeTotal(input.items),
    shipping: input.shipping,
    locale: input.locale,
    comment: input.comment,
    createdAt: now,
    updatedAt: now,
  };

  // Store first: if this fails the caller reports the order as failed, which
  // is correct — nothing was kept.
  await recordOrder(order);

  // Notifications are best-effort. The order already exists, so a mail outage
  // must not tell the customer it failed and make them order twice.
  const seller = sellerEmail(order);
  const buyer = buyerEmail(order);
  const [sellerResult, buyerResult] = await Promise.all([
    sendMail({ to: SELLER_EMAIL, subject: seller.subject, body: seller.body }),
    sendMail({ to: order.customer.email, subject: buyer.subject, body: buyer.body }),
  ]);

  // Record the outcome on the order itself. Provider failures are otherwise
  // only visible in the function logs, which is no help when a notification
  // silently never arrives.
  const status = [
    `seller: ${sellerResult.ok ? 'ok' : `failed — ${sellerResult.error}`}`,
    `buyer: ${buyerResult.ok ? 'ok' : `failed — ${buyerResult.error}`}`,
  ].join(' | ');

  if (!sellerResult.ok || !buyerResult.ok) {
    console.error(`[orders] ${order.id} stored but notification incomplete — ${status}`);
  }

  await markNotifyStatus(order.id, status);

  return order;
}
