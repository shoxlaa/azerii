import type { CollectionConfig } from 'payload';
import { MODEL_SCALES } from '../constants';

const authed = ({ req }: { req: { user?: unknown } }) => Boolean(req.user);

/**
 * MuseumItems — finished models on display in the museum.
 *
 * Deliberately separate from `products`: an exhibit is a built model (often
 * assembled by a child), not merchandise. It has no price, status or stock.
 * The optional `product` relationship links an exhibit to the kit we sell,
 * when such a kit exists.
 */
export const MuseumItems: CollectionConfig = {
  slug: 'museum-items',
  labels: {
    singular: 'Экспонат музея',
    plural: 'Музей',
  },
  admin: {
    group: 'Музей',
    useAsTitle: 'title',
    defaultColumns: ['title', 'category', 'scale', 'product'],
    description: 'Готовые собранные модели из экспозиции. Не товары.',
  },
  access: {
    read: () => true, // the museum page is public
    create: authed,
    update: authed,
    delete: authed,
  },
  fields: [
    {
      name: 'title',
      type: 'text',
      required: true,
      localized: true,
      admin: { description: 'Название модели, напр. «Messerschmitt Bf 109Z Zwilling».' },
    },
    {
      name: 'mainImage',
      type: 'upload',
      relationTo: 'media',
      required: true,
      admin: { description: 'Главное фото — показывается на карточке в галерее.' },
    },
    {
      name: 'gallery',
      type: 'upload',
      relationTo: 'media',
      hasMany: true,
      admin: { description: 'Дополнительные фото (необязательно).' },
    },
    {
      name: 'category',
      type: 'select',
      required: true,
      options: [
        { label: 'Автомобили', value: 'cars' },
        { label: 'Бронетехника', value: 'armor' },
        { label: 'Авиация', value: 'aviation' },
        { label: 'Миниатюры', value: 'miniatures' },
        { label: 'ЖД модели', value: 'railway' },
        { label: 'Судомодели', value: 'ships' },
      ],
      admin: { description: 'Раздел галереи.' },
    },
    {
      name: 'scale',
      type: 'select',
      options: MODEL_SCALES.map((s) => ({ label: s, value: s })),
      admin: { description: 'Масштаб (необязательно).' },
    },
    {
      name: 'description',
      type: 'richText',
      localized: true,
      admin: { description: 'История модели, кто собрал, интересные факты.' },
    },
    {
      name: 'product',
      type: 'relationship',
      relationTo: 'products',
      admin: {
        description:
          'Если этот набор есть у нас в продаже — выберите товар. Если нет, оставьте пустым.',
      },
    },
  ],
};
