import type { CollectionConfig } from 'payload';

/**
 * DailyVisits — one row per day holding that day's visitor count.
 *
 * Readable by anyone (the footer shows the number), but writable only from our
 * own server code: `create`/`update`/`delete` are closed outright, which shuts
 * the public REST endpoints. The visit route still writes because it goes
 * through the Local API, which bypasses access control.
 */
export const DailyVisits: CollectionConfig = {
  slug: 'daily-visits',
  labels: { singular: 'Посещения за день', plural: 'Посещаемость' },
  admin: {
    group: 'Статистика',
    useAsTitle: 'date',
    defaultColumns: ['date', 'count'],
    description: 'Счётчик посетителей по дням (часовой пояс Баку).',
  },
  access: {
    read: () => true,
    // Written only via the Local API — never over REST.
    create: () => false,
    update: () => false,
    delete: () => false,
  },
  fields: [
    {
      name: 'date',
      type: 'text',
      required: true,
      unique: true,
      index: true,
      admin: { readOnly: true, description: 'Дата в формате YYYY-MM-DD (Asia/Baku).' },
    },
    {
      name: 'count',
      type: 'number',
      required: true,
      defaultValue: 0,
      admin: { readOnly: true },
    },
  ],
};
