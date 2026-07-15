import 'server-only';

/**
 * Order handling (server-only).
 *
 * Placeholder logic. Persist orders to a database and trigger payment /
 * confirmation flows here later.
 */

import type { Order, OrderItem, Customer, Locale } from '@/types';
import { sendMail } from './mail';

export interface CreateOrderInput {
  items: OrderItem[];
  customer: Customer;
  locale: Locale;
  comment?: string;
}

/** Sum all line items into a total, in EUR cents. */
function computeTotal(items: OrderItem[]): number {
  return items.reduce((sum, i) => sum + i.unitPriceEur * i.quantity, 0);
}

/**
 * Create a new order.
 *
 * Stub implementation: builds the Order object and sends a confirmation
 * email. Does not persist anything yet.
 */
export async function createOrder(input: CreateOrderInput): Promise<Order> {
  const now = new Date().toISOString();
  const order: Order = {
    id: `ord_${now}`,
    items: input.items,
    customer: input.customer,
    status: 'pending',
    totalEur: computeTotal(input.items),
    locale: input.locale,
    comment: input.comment,
    createdAt: now,
    updatedAt: now,
  };

  await sendMail({
    to: input.customer.email,
    subject: `AZERII order ${order.id}`,
    body: `Thank you for your order. Total: ${order.totalEur} EUR cents.`,
  });

  return order;
}
