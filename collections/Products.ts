import type { CollectionConfig } from 'payload';
import { CATEGORY_TYPES, PRODUCT_STATUSES, TECH_TYPES } from '../constants';
import { isValidSlug, slugify } from '../lib/slug';

const authed = ({ req }: { req: { user?: unknown } }) => Boolean(req.user);

/**
 * Products — catalog items (scale models).
 * Fields mirror our domain model in types/index.ts.
 * Prices are stored as decimal EUR — numeric(10,2), e.g. 499.99.
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
      admin: {
        description:
          'Каталожный код — используется как slug (URL). Приводится к безопасному виду автоматически: строчные латинские буквы, цифры и дефисы (напр. «AZ-TNK-T28 test» → «az-tnk-t28-test»).',
        placeholder: 'az-tnk-t28-kt28',
      },
      hooks: {
        // Runs before validation on BOTH create and update, so a hand-typed
        // code can never reach the database (or a URL) with spaces, uppercase
        // or other unsafe characters.
        beforeValidate: [
          ({ value }) => (typeof value === 'string' ? slugify(value) : value),
        ],
      },
      validate: (value: string | null | undefined) => {
        if (!value) {
          // Either genuinely empty, or slugify stripped everything usable
          // (e.g. "!!!" or a code with no Latin/Cyrillic characters).
          return 'Укажите каталожный код: латинские буквы или цифры (напр. az-tnk-t28-kt28).';
        }
        if (!isValidSlug(value)) {
          return `Недопустимый код. Разрешены только строчные латинские буквы, цифры и дефисы, напр. «${slugify(value) || 'az-tnk-t28-kt28'}».`;
        }
        return true;
      },
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
      admin: {
        description: 'Цена в EUR (напр. 499.99).',
        step: 0.01,
        placeholder: '499.99',
      },
      validate: (value: number | null | undefined) => {
        if (value === null || value === undefined) return 'Укажите цену.';
        if (typeof value !== 'number' || Number.isNaN(value)) return 'Цена должна быть числом.';
        if (value <= 0) return 'Цена должна быть больше нуля.';
        // At most 2 decimal places (499.99 ok, 499.999 not). The epsilon absorbs
        // binary float noise, e.g. 499.99 * 100 === 49999.00000000001.
        if (Math.abs(value - Math.round(value * 100) / 100) > 1e-9) {
          return 'Не более двух знаков после запятой (напр. 499.99).';
        }
        return true;
      },
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
      admin: {
        description:
          'Изображения (загрузка в Supabase Storage). Порядок важен: первое фото — главное в каталоге, последнее — в музейном таймлайне.',
      },
    },
    {
      name: 'description',
      type: 'richText',
      localized: true,
      admin: { description: 'Описание (EN/RU).' },
    },
    {
      /**
       * Museum-timeline history of the original vehicle.
       *
       * Only complete vehicles have a history to tell — chassis, track sets and
       * spare parts leave this empty. A product appears on the museum timeline
       * exactly when `year` here is filled in, and the timeline sorts on it.
       *
       * The figures describe the historical vehicle, not the kit, and are
       * printed verbatim (not localized), so carry their own units.
       */
      name: 'history',
      type: 'group',
      admin: {
        description:
          'История оригинала для музейного таймлайна. Заполняйте только для готовых машин (танк, автомобиль, самолёт). Модель попадает на таймлайн, когда указан год; пустой год — модели на ленте нет.',
      },
      fields: [
        {
          name: 'year',
          type: 'number',
          min: 0,
          admin: {
            description: 'Год выпуска / принятия на вооружение. По нему модель встаёт на таймлайн.',
            placeholder: '1935',
            width: '50%',
          },
        },
        {
          name: 'country',
          type: 'text',
          admin: {
            description: 'Страна происхождения (латиницей, напр. «France»).',
            placeholder: 'France',
            width: '50%',
          },
        },
        {
          name: 'crew',
          type: 'text',
          admin: { description: 'Экипаж, напр. «3».', placeholder: '3', width: '25%' },
        },
        {
          name: 'armor',
          type: 'text',
          admin: { description: 'Броня с единицами, напр. «47 mm».', placeholder: '47 mm', width: '25%' },
        },
        {
          name: 'engine',
          type: 'text',
          admin: { description: 'Двигатель, напр. «190 hp».', placeholder: '190 hp', width: '25%' },
        },
        {
          name: 'weight',
          type: 'text',
          admin: { description: 'Масса, напр. «19.5 t».', placeholder: '19.5 t', width: '25%' },
        },
      ],
    },
  ],
};
