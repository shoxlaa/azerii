import type { CollectionConfig } from 'payload';

const authed = ({ req }: { req: { user?: unknown } }) => Boolean(req.user);

/**
 * Paintings — canvases shown in the AZERII gallery.
 *
 * Deliberately separate from `products`: a painting is a single physical piece
 * with no scale, no manufacturing technology and no stock, so the catalog's
 * fields would be meaningless here. It is currently a showcase — the gallery
 * shows a price and sends the buyer to the contact page, so there is no cart
 * integration and no order status.
 *
 * Prices are stored as decimal EUR, matching `products`.
 */
export const Paintings: CollectionConfig = {
  slug: 'paintings',
  labels: {
    singular: 'Картина',
    plural: 'Галерея',
  },
  admin: {
    group: 'Галерея',
    useAsTitle: 'title',
    defaultColumns: ['title', 'size', 'workType', 'material', 'price'],
    description: 'Картины на холсте. Витрина — заказ оформляется через обращение.',
  },
  access: {
    read: () => true, // the gallery page is public
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
      admin: { description: 'Название работы (EN/RU).' },
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
      admin: { description: 'Дополнительные фото: детали, фрагменты (необязательно).' },
    },
    {
      name: 'size',
      type: 'text',
      required: true,
      admin: {
        description: 'Размер полотна, напр. «60×80 см».',
        placeholder: '60×80 см',
      },
    },
    {
      name: 'workType',
      type: 'select',
      required: true,
      options: [
        { label: 'Масло', value: 'oil' },
        { label: 'Акрил', value: 'acrylic' },
        { label: 'Акварель', value: 'watercolor' },
        { label: 'Графика', value: 'graphics' },
        { label: 'Смешанная техника', value: 'mixed' },
        { label: 'Печать / репродукция', value: 'print' },
      ],
      admin: { description: 'Тип работы.' },
    },
    {
      name: 'material',
      type: 'select',
      required: true,
      options: [
        { label: 'Холст', value: 'canvas' },
        { label: 'Холст на картоне', value: 'canvas_on_board' },
        { label: 'Бумага', value: 'paper' },
        { label: 'Дерево', value: 'wood' },
      ],
      admin: { description: 'Материал основы.' },
    },
    {
      name: 'price',
      type: 'number',
      required: true,
      min: 0,
      admin: {
        description: 'Цена в EUR (напр. 450.00).',
        step: 0.01,
        placeholder: '450.00',
      },
      // Same rules as products.price — kept in step so the two never disagree.
      validate: (value: number | null | undefined) => {
        if (value === null || value === undefined) return 'Укажите цену.';
        if (typeof value !== 'number' || Number.isNaN(value)) return 'Цена должна быть числом.';
        if (value <= 0) return 'Цена должна быть больше нуля.';
        if (Math.abs(value - Math.round(value * 100) / 100) > 1e-9) {
          return 'Не более двух знаков после запятой (напр. 450.00).';
        }
        return true;
      },
    },
    {
      name: 'description',
      type: 'richText',
      localized: true,
      admin: { description: 'Описание работы: сюжет, история, автор.' },
    },
  ],
};
