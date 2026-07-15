import type { CollectionConfig } from 'payload';

/**
 * Media — upload collection for product images.
 * Files are stored in Supabase Storage (S3-compatible) when configured,
 * otherwise on local disk (dev fallback).
 */
export const Media: CollectionConfig = {
  slug: 'media',
  access: {
    read: () => true,
  },
  upload: {
    mimeTypes: ['image/*'],
  },
  fields: [
    {
      name: 'alt',
      type: 'text',
      label: 'Alt text',
    },
  ],
};
