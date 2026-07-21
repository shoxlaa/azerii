import type { CollectionConfig } from 'payload';

const authed = ({ req }: { req: { user?: unknown } }) => Boolean(req.user);

/**
 * Orders — customer order requests.
 *
 * Locked down on every operation: an order holds personal data (name, e-mail,
 * phone, address), so nothing here may be publicly readable. Orders are still
 * created by anonymous customers — `submitOrder` writes through the Local API,
 * which bypasses access control, so `create: authed` blocks the public REST
 * endpoint without blocking checkout.
 *
 * Line items are stored as JSON rather than an array field on purpose: an
 * order is an immutable snapshot of what was bought at that moment, never
 * queried per-line. That also keeps the collection to a single table, which
 * matters because schema changes here are applied by hand (see migrations/).
 */
export const Orders: CollectionConfig = {
  slug: 'orders',
  labels: { singular: 'Заказ', plural: 'Заказы' },
  admin: {
    group: 'Заказы',
    useAsTitle: 'orderNumber',
    defaultColumns: ['orderNumber', 'status', 'total', 'customerEmail', 'createdAt'],
    description: 'Заявки покупателей. Оплата пока не принимается онлайн.',
  },
  access: {
    read: authed,
    create: authed,
    update: authed,
    delete: authed,
  },
  fields: [
    {
      name: 'orderNumber',
      type: 'text',
      required: true,
      unique: true,
      index: true,
      admin: { readOnly: true, description: 'Номер заказа, который видит покупатель.' },
    },
    {
      name: 'status',
      type: 'select',
      required: true,
      defaultValue: 'pending',
      options: [
        { label: 'Новый', value: 'pending' },
        { label: 'Оплачен', value: 'paid' },
        { label: 'В работе', value: 'processing' },
        { label: 'Отправлен', value: 'shipped' },
        { label: 'Доставлен', value: 'delivered' },
        { label: 'Отменён', value: 'cancelled' },
      ],
    },
    {
      name: 'total',
      type: 'number',
      required: true,
      admin: { readOnly: true, description: 'Итог в EUR на момент заказа.' },
    },
    {
      name: 'shipping',
      type: 'select',
      required: true,
      options: [
        { label: 'Стандартная доставка', value: 'standard' },
        { label: 'Экспресс-доставка', value: 'express' },
        { label: 'Самовывоз (Баку)', value: 'pickup' },
      ],
    },
    {
      name: 'orderLocale',
      type: 'select',
      options: [
        { label: 'English', value: 'en' },
        { label: 'Русский', value: 'ru' },
      ],
      admin: { description: 'Язык, на котором оформлялся заказ.' },
    },
    {
      name: 'items',
      type: 'json',
      required: true,
      admin: {
        readOnly: true,
        description: 'Состав заказа на момент оформления: название, цена, количество.',
      },
    },
    // Flat customer fields (not a group) so they are searchable columns in the
    // admin list and map to plain columns in the database.
    {
      name: 'customerName',
      type: 'text',
      required: true,
      admin: { readOnly: true },
    },
    {
      name: 'customerEmail',
      type: 'email',
      required: true,
      index: true,
      admin: { readOnly: true },
    },
    {
      name: 'customerPhone',
      type: 'text',
      admin: { readOnly: true },
    },
    {
      name: 'customerAddress',
      type: 'textarea',
      admin: { readOnly: true, description: 'Страна, город, адрес, индекс.' },
    },
    {
      name: 'comment',
      type: 'textarea',
      admin: { readOnly: true, description: 'Комментарий покупателя.' },
    },
  ],
};
