-- Azerbaijani locale.
--
-- Payload stores locales as postgres enums, so adding 'az' to the config is
-- not enough: every `*_locales` table (products, museum_items, paintings)
-- constrains its `_locale` column to the `_locales` type, and orders keep the
-- ordering language in a separate enum. Without this, saving Azerbaijani
-- content fails with `invalid input value for enum`.
--
-- Verified against the live database before writing:
--   _locales                 = en, ru
--   enum_orders_order_locale = en, ru
--   server_version           = 17.6
--
-- On PostgreSQL 12+ `ALTER TYPE ... ADD VALUE` may run inside a transaction
-- block (the restriction people remember is from 11 and earlier); the only
-- remaining rule is that the new value cannot be *used* until the transaction
-- commits, and nothing here uses it. `IF NOT EXISTS` keeps the file safe to
-- re-run.
--
-- Purely additive: no existing table, row or enum value is touched.

BEGIN;

-- 1. UI / content locales ----------------------------------------------------
ALTER TYPE _locales ADD VALUE IF NOT EXISTS 'az';

-- 2. Language an order was placed in -----------------------------------------
ALTER TYPE enum_orders_order_locale ADD VALUE IF NOT EXISTS 'az';

COMMIT;

-- Verify: expect en,ru,az for both
-- SELECT t.typname, string_agg(e.enumlabel, ',' ORDER BY e.enumsortorder)
--   FROM pg_type t JOIN pg_enum e ON e.enumtypid = t.oid
--  WHERE t.typname IN ('_locales', 'enum_orders_order_locale')
--  GROUP BY t.typname;
