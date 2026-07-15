import type { CollectionConfig } from 'payload';
import { CATEGORY_TYPES, PRODUCT_STATUSES, TECH_TYPES } from '../constants';

const authed = ({ req }: { req: { user?: unknown } }) => Boolean(req.user);

/**
 * Products — catalog items (scale models).
 * Fields mirror our domain model in types/index.ts.
 * Prices are stored as integer EUR cents.
 */
export const Products: CollectionConfig = {
  slug: 'products',
  admin: {
    useAsTitle: 'catalogCode',
    defaultColumns: ['catalogCode', 'code', 'type', 'status', 'price'],
  },
  access: {
    read: () => true, // storefront reads products publicly
    create: authed,
    update: authed,
    delete: authed,
  },
  fields: [
    {
      name: 'code',
      type: 'text',
      required: true,
      admin: { description: 'Внутренний код товара.' },
    },
    {
      name: 'catalogCode',
      type: 'text',
      required: true,
      unique: true,
      index: true,
      admin: { description: 'Каталожный код — используется как slug (URL).' },
    },
    {
      name: 'name',
      type: 'text',
      required: true,
      localized: true,
      admin: { description: 'Название (EN/RU).' },
    },
    {
      name: 'type',
      type: 'select',
      required: true,
      options: [...CATEGORY_TYPES],
      admin: { description: 'Категория техники.' },
    },
    {
      name: 'technology',
      type: 'select',
      hasMany: true,
      options: [...TECH_TYPES],
      admin: { description: 'Технология изготовления (можно несколько).' },
    },
    {
      name: 'scale',
      type: 'text',
      admin: { description: 'Масштаб, напр. 1/16.' },
    },
    {
      name: 'price',
      type: 'number',
      required: true,
      min: 0,
      admin: { description: 'Цена в центах EUR (напр. 49900 = €499.00).' },
    },
    {
      name: 'stock',
      type: 'number',
      defaultValue: 0,
      min: 0,
      admin: { description: 'Количество на складе.' },
    },
    {
      name: 'status',
      type: 'select',
      required: true,
      defaultValue: 'in_stock',
      options: [...PRODUCT_STATUSES],
      admin: { description: 'Статус товара.' },
    },
    {
      name: 'images',
      type: 'upload',
      relationTo: 'media',
      hasMany: true,
      admin: { description: 'Изображения (загрузка в Supabase Storage).' },
    },
    {
      name: 'description',
      type: 'richText',
      localized: true,
      admin: { description: 'Описание (EN/RU).' },
    },
  ],
};
