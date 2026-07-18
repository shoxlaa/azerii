import path from 'path';
import { fileURLToPath } from 'url';
import { buildConfig } from 'payload';
import { postgresAdapter } from '@payloadcms/db-postgres';
import { lexicalEditor } from '@payloadcms/richtext-lexical';
import { s3Storage } from '@payloadcms/storage-s3';
import sharp from 'sharp';

import { Products } from './collections/Products';
import { Media } from './collections/Media';
import { Users } from './collections/Users';

const filename = fileURLToPath(import.meta.url);
const dirname = path.dirname(filename);

/**
 * Payload needs these at runtime. Missing values surface as a generic
 * "There was an error initializing Payload" (500 on /admin and /api/*), so
 * name them explicitly in the logs. Deliberately logged, not thrown: throwing
 * here would fail the whole build instead of just the Payload routes.
 */
const missingEnv = (['PAYLOAD_SECRET', 'DATABASE_URI'] as const).filter(
  (key) => !process.env[key],
);
if (missingEnv.length > 0) {
  console.error(
    `[payload] Missing required environment variable(s): ${missingEnv.join(', ')}. ` +
      'Payload cannot initialize — set them in your hosting environment settings.',
  );
}

/**
 * Supabase Storage (S3-compatible) is enabled only when S3_BUCKET is set.
 * Without it, uploads fall back to local disk so the admin works pre-config.
 */
const storagePlugins = process.env.S3_BUCKET
  ? [
      s3Storage({
        collections: { media: true },
        bucket: process.env.S3_BUCKET,
        config: {
          endpoint: process.env.S3_ENDPOINT,
          region: process.env.S3_REGION || 'us-east-1',
          forcePathStyle: true, // required for Supabase Storage
          credentials: {
            accessKeyId: process.env.S3_ACCESS_KEY_ID || '',
            secretAccessKey: process.env.S3_SECRET_ACCESS_KEY || '',
          },
        },
      }),
    ]
  : [];

export default buildConfig({
  admin: {
    user: Users.slug,
    importMap: { baseDir: path.resolve(dirname) },
  },
  collections: [Products, Media, Users],
  editor: lexicalEditor(),
  secret: process.env.PAYLOAD_SECRET || '',
  typescript: {
    outputFile: path.resolve(dirname, 'payload-types.ts'),
  },
  localization: {
    locales: ['en', 'ru'],
    defaultLocale: 'en',
  },
  db: postgresAdapter({
    pool: {
      connectionString: process.env.DATABASE_URI || '',
      // Supabase's pooler presents a certificate that Node can't verify against
      // the system trust store; accept it (TLS is still used, just not verified).
      ssl: { rejectUnauthorized: false },
    },
  }),
  sharp,
  plugins: [...storagePlugins],
});
