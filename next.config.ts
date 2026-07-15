import type { NextConfig } from 'next';
import { withPayload } from '@payloadcms/next/withPayload';

const nextConfig: NextConfig = {
  images: {
    // Allow serving product images directly from Supabase Storage
    // (used if the bucket is public / direct URLs are enabled).
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '**.supabase.co',
      },
    ],
  },
};

export default withPayload(nextConfig);
