import type { NextConfig } from 'next';
import { withPayload } from '@payloadcms/next/withPayload';

const nextConfig: NextConfig = {
  images: {
    /**
     * Width ladders, trimmed from the Next defaults.
     *
     * Every distinct (image, width) pair is a billed transformation, and the
     * defaults offer 8 device widths + 7 image widths. This layout does not
     * use that range: --container-site caps content at 1200px, so only the
     * full-bleed hero ever needs more, and 2048 covers it. 3840 served 4K
     * alone while being the most expensive entry in the list.
     *
     * Dropped: 750 and 1080 (within ~11% of neighbours that remain), 3840,
     * and the 32/64 image widths (no slot in the UI resolves to them).
     */
    deviceSizes: [640, 828, 1200, 1920, 2048],
    imageSizes: [48, 96, 128, 256, 384],

    /**
     * 7 days, up from the 4-hour default — each expiry re-runs the
     * transformation for every cached width.
     *
     * Not longer, deliberately: Next has no cache invalidation, and this
     * project replaces hero photographs in place under an unchanged filename
     * (see hero-german-field.jpg). A 31-day TTL would leave such a swap
     * invisible for a month. Give a replacement a new filename and this can
     * safely go up.
     */
    minimumCacheTTL: 604800,

    // Allow serving product images directly from Supabase Storage
    // (used if the bucket is public / direct URLs are enabled).
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '**.supabase.co',
      },
      {
        protocol: 'https',
        hostname: 'i.ytimg.com',
      },
    ],
  },
};

export default withPayload(nextConfig);
