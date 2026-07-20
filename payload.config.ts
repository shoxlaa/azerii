import path from 'path';
import { fileURLToPath } from 'url';
import { buildConfig } from 'payload';
import { postgresAdapter } from '@payloadcms/db-postgres';
import { lexicalEditor } from '@payloadcms/richtext-lexical';
import { s3Storage } from '@payloadcms/storage-s3';
import sharp from 'sharp';

import { Products } from './collections/Products';
import { Media } from './collections/Media';
import { MuseumItems } from './collections/MuseumItems';
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
  collections: [Products, MuseumItems, Media, Users],
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
    /**
     * Expects Supabase's TRANSACTION pooler (port 6543), not the session
     * pooler (5432). Session mode holds a server connection for the whole life
     * of a client and caps everyone — production plus local development — at
     * 15 clients, which serverless exhausted constantly (`EMAXCONNSESSION`,
     * then 500s from every Payload route). Transaction mode only holds a
     * connection for the duration of a transaction, so instances share far
     * more effectively.
     *
     * Safe here because nothing in this project needs session state: Payload
     * and drizzle issue only *unnamed* prepared statements, and there is no
     * LISTEN/NOTIFY, advisory locking, SET, temp table or cursor usage.
     */
    pool: {
      connectionString: process.env.DATABASE_URI || '',
      max: Number(process.env.DATABASE_POOL_MAX ?? 10),
      // Hand connections back to the pooler promptly rather than idling on them.
      idleTimeoutMillis: 10_000,
      // Fail fast instead of queueing forever if the pooler is saturated;
      // lib/data.ts retries transient failures.
      connectionTimeoutMillis: 10_000,
      // Supabase's pooler presents a certificate that Node can't verify against
      // the system trust store; accept it (TLS is still used, just not verified).
      ssl: { rejectUnauthorized: false },
    },
    /**
     * Dev-time schema push runs drizzle-kit introspection, which times out
     * through the pooler (the reason migrations/*.sql are written by hand).
     * Turning it off stops Payload retrying it on every boot.
     */
    push: false,
    // Creating databases is not possible through a pooler.
    disableCreateDatabase: true,
  }),
  sharp,
  plugins: [...storagePlugins],
});
