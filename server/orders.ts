import 'server-only';

/**
 * Order handling (server-only).
 *
 * Builds the Order, records it, and emails both the seller and the buyer.
 * Online payment is intentionally not part of this flow — an order is taken
 * as a *request*, and payment (Stripe/PayPal) is a later step.
 *
 * `recordOrder` is still a stub: it logs the order. Swap it for a Payload
 * collection / DB insert when the orders table exists.
 */

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

/** Persist the order. Stub: logs it. Replace with a DB/Payload write. */
async function recordOrder(order: Order): Promise<void> {
  console.info('[orders] recorded', order.id, {
    total: order.totalEur,
    items: order.items.length,
    shipping: order.shipping,
    email: order.customer.email,
  });
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

  await recordOrder(order);

  const seller = sellerEmail(order);
  const buyer = buyerEmail(order);
  await Promise.all([
    sendMail({ to: SELLER_EMAIL, subject: seller.subject, body: seller.body }),
    sendMail({ to: order.customer.email, subject: buyer.subject, body: buyer.body }),
  ]);

  return order;
}
