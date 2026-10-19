-- New product categories: model boxes, miniatures, tools.
--
-- Payload stores the `products.type` select as a postgres enum, and schema
-- push is off (see payload.config.ts), so adding values to CATEGORY_TYPES is
-- not enough: saving a product with a new type fails with
-- `invalid input value for enum enum_products_type` until this has run.
--
-- Verified against the live database before writing:
--   enum_products_type = tank, chassis, tracks, armored_car
--   server_version     = 17.6
--
-- On PostgreSQL 12+ `ALTER TYPE ... ADD VALUE` may run inside a transaction
-- block; the new values just can't be used until it commits, and nothing here
-- uses them. `IF NOT EXISTS` keeps the file safe to re-run.
--
-- IMPORTANT: apply this BEFORE (or with) the deploy that adds the new types.
--
-- Purely additive: no existing table, row or enum value is touched.

BEGIN;

ALTER TYPE enum_products_type ADD VALUE IF NOT EXISTS 'model_box';
ALTER TYPE enum_products_type ADD VALUE IF NOT EXISTS 'miniature';
ALTER TYPE enum_products_type ADD VALUE IF NOT EXISTS 'tools';

COMMIT;

-- Verify: expect tank,chassis,tracks,armored_car,model_box,miniature,tools
-- SELECT string_agg(e.enumlabel, ',' ORDER BY e.enumsortorder)
--   FROM pg_type t JOIN pg_enum e ON e.enumtypid = t.oid
--  WHERE t.typname = 'enum_products_type';
