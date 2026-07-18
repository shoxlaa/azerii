import type { CollectionConfig } from 'payload';

/**
 * Media — upload collection for product images.
 *
 * Files are stored in Supabase Storage (S3-compatible) when configured,
 * otherwise on local disk (dev fallback).
 *
 * Every upload is normalized by sharp on the way in: downscaled to at most
 * 1500px wide and re-encoded as WebP. Originals from a camera/phone are often
 * 4000px+ JPEGs, so this is a large storage saving with no visible quality
 * loss at the sizes the storefront actually renders.
 */
const WEBP = (quality: number) => ({ format: 'webp' as const, options: { quality } });

export const Media: CollectionConfig = {
  slug: 'media',
  access: {
    read: () => true,
  },
  upload: {
    mimeTypes: ['image/*'],
    // Cap the stored original at ~1500px wide; never upscale a smaller image.
    resizeOptions: {
      width: 1500,
      fit: 'inside',
      withoutEnlargement: true,
    },
    formatOptions: WEBP(82),
    // Smaller derivatives for grids and the admin list.
    imageSizes: [
      {
        name: 'thumbnail',
        width: 400,
        fit: 'inside',
        withoutEnlargement: true,
        formatOptions: WEBP(78),
      },
      {
        name: 'card',
        width: 900,
        fit: 'inside',
        withoutEnlargement: true,
        formatOptions: WEBP(80),
      },
    ],
    adminThumbnail: 'thumbnail',
  },
  fields: [
    {
      name: 'alt',
      type: 'text',
      label: 'Alt text',
    },
  ],
};
