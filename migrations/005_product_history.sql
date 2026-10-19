-- Product history for the museum timeline (collection `products`, group `history`).
--
-- Schema push is off (see payload.config.ts), so the columns Payload would
-- generate for the new `history` group are added here by hand. A Payload
-- `group` field flattens into the parent table, one column per sub-field,
-- prefixed with the group name — exactly what mapProduct in lib/data.ts reads.
--
-- These columns are NOT localized (the figures are printed verbatim), so they
-- live on `products` itself, not `products_locales`.
--
-- The second half backfills the fourteen vehicles that used to live in the
-- hand-maintained constants/museumHistory.ts, keyed by catalog_code, so the
-- timeline renders identically after the source of truth moves into the CMS.
-- A code that matches no product simply updates nothing.
--
-- IMPORTANT: apply this BEFORE (or with) the deploy that adds the `history`
-- field to the config — once Payload knows the field it SELECTs these columns
-- on every product query, and a missing column would break the catalog.
--
-- Purely additive: no existing column or row value is removed. Safe to run once.

BEGIN;

-- 1. Columns for the `history` group ----------------------------------------
-- `year` is a Payload number field -> numeric, matching how `price` is stored.
ALTER TABLE products ADD COLUMN IF NOT EXISTS history_year    numeric;
ALTER TABLE products ADD COLUMN IF NOT EXISTS history_country varchar;
ALTER TABLE products ADD COLUMN IF NOT EXISTS history_crew    varchar;
ALTER TABLE products ADD COLUMN IF NOT EXISTS history_armor   varchar;
ALTER TABLE products ADD COLUMN IF NOT EXISTS history_engine  varchar;
ALTER TABLE products ADD COLUMN IF NOT EXISTS history_weight  varchar;

-- 2. Backfill the previously curated vehicles -------------------------------
UPDATE products AS p SET
  history_year    = v.year,
  history_country = v.country,
  history_crew    = v.crew,
  history_armor   = v.armor,
  history_engine  = v.engine,
  history_weight  = v.weight
FROM (VALUES
  ('az-tnk-vickers-mk-e',        1928, 'United Kingdom', '3', '13 mm', '80 hp',  '7.2 t'),
  ('az-tnk-t-26-1932',           1932, 'USSR',           '3', '15 mm', '90 hp',  '8.2 t'),
  ('az-tnk-t-28-kt-28',          1933, 'USSR',           '6', '30 mm', '500 hp', '25.4 t'),
  ('az-tnk-t-26-1933',           1933, 'USSR',           '3', '15 mm', '90 hp',  '9.4 t'),
  ('az-tnk-t-29-5',              1934, 'USSR',           '5', '30 mm', '500 hp', '28.5 t'),
  ('az-tnk-t-26-1934',           1934, 'USSR',           '3', '15 mm', '90 hp',  '9.6 t'),
  ('az-tnk-somua-s35',           1935, 'France',         '3', '47 mm', '190 hp', '19.5 t'),
  ('az-tnk-7tp-tank-model-set',  1935, 'Poland',         '3', '17 mm', '110 hp', '9.9 t'),
  ('az-tnk-renault-d2',          1936, 'France',         '3', '40 mm', '150 hp', '19.8 t'),
  ('az-tnk-char-b1-bis',         1937, 'France',         '4', '60 mm', '307 hp', '31.5 t'),
  ('az-tnk-t-26-1938',           1938, 'USSR',           '3', '15 mm', '95 hp',  '10.3 t'),
  ('az-tnk-t-26-1939',           1939, 'USSR',           '3', '20 mm', '97 hp',  '10.3 t'),
  ('az-tnk-t-50',                1941, 'USSR',           '4', '37 mm', '300 hp', '13.8 t'),
  ('az-tnk-t-70',                1942, 'USSR',           '2', '45 mm', '140 hp', '9.2 t')
) AS v(catalog_code, year, country, crew, armor, engine, weight)
WHERE p.catalog_code = v.catalog_code;

COMMIT;
