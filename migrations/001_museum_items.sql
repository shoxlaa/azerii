-- Museum exhibits (collection `museum-items`).
--
-- Normally Payload creates this automatically in dev mode, but its schema
-- introspection times out against Supabase's session pooler, and the direct
-- (migration-friendly) endpoint is IPv6-only. So the tables are created here
-- explicitly, mirroring exactly what Payload generates for `products`:
--   <table>            scalar fields + single relations
--   <table>_locales    localized fields (title, description)
--   <table>_rels       hasMany relations (the extra gallery photos)
--
-- Purely additive: no existing table or row is touched. Safe to run once.

BEGIN;

-- 1. Enumerated field values ------------------------------------------------
CREATE TYPE enum_museum_items_category AS ENUM (
  'cars', 'armor', 'aviation', 'miniatures', 'railway', 'ships'
);

CREATE TYPE enum_museum_items_scale AS ENUM (
  '1:8', '1:16', '1:18', '1:24', '1:35', '1:43', '1:64', '1:72', '1:144'
);

-- 2. Main table --------------------------------------------------------------
CREATE TABLE museum_items (
  id            serial PRIMARY KEY,
  main_image_id integer,
  category      enum_museum_items_category NOT NULL,
  scale         enum_museum_items_scale,
  product_id    integer,
  updated_at    timestamp(3) with time zone DEFAULT now() NOT NULL,
  created_at    timestamp(3) with time zone DEFAULT now() NOT NULL
);

CREATE INDEX museum_items_main_image_idx ON museum_items USING btree (main_image_id);
CREATE INDEX museum_items_product_idx    ON museum_items USING btree (product_id);
CREATE INDEX museum_items_updated_at_idx ON museum_items USING btree (updated_at);
CREATE INDEX museum_items_created_at_idx ON museum_items USING btree (created_at);

-- Deleting a photo or a product must not delete the exhibit itself.
ALTER TABLE museum_items
  ADD CONSTRAINT museum_items_main_image_fk
  FOREIGN KEY (main_image_id) REFERENCES media(id) ON DELETE SET NULL;

ALTER TABLE museum_items
  ADD CONSTRAINT museum_items_product_fk
  FOREIGN KEY (product_id) REFERENCES products(id) ON DELETE SET NULL;

-- 3. Localized fields (EN / RU) ----------------------------------------------
CREATE TABLE museum_items_locales (
  id          serial PRIMARY KEY,
  title       character varying NOT NULL,
  description jsonb,
  _locale     _locales NOT NULL,
  _parent_id  integer NOT NULL
);

CREATE UNIQUE INDEX museum_items_locales_locale_parent_id_unique
  ON museum_items_locales USING btree (_locale, _parent_id);

ALTER TABLE museum_items_locales
  ADD CONSTRAINT museum_items_locales_parent_id_fk
  FOREIGN KEY (_parent_id) REFERENCES museum_items(id) ON DELETE CASCADE;

-- 4. Extra gallery photos (hasMany upload) -----------------------------------
CREATE TABLE museum_items_rels (
  id        serial PRIMARY KEY,
  "order"   integer,
  parent_id integer NOT NULL,
  path      character varying NOT NULL,
  media_id  integer
);

CREATE INDEX museum_items_rels_order_idx    ON museum_items_rels USING btree ("order");
CREATE INDEX museum_items_rels_parent_idx   ON museum_items_rels USING btree (parent_id);
CREATE INDEX museum_items_rels_path_idx     ON museum_items_rels USING btree (path);
CREATE INDEX museum_items_rels_media_id_idx ON museum_items_rels USING btree (media_id);

ALTER TABLE museum_items_rels
  ADD CONSTRAINT museum_items_rels_parent_fk
  FOREIGN KEY (parent_id) REFERENCES museum_items(id) ON DELETE CASCADE;

ALTER TABLE museum_items_rels
  ADD CONSTRAINT museum_items_rels_media_fk
  FOREIGN KEY (media_id) REFERENCES media(id) ON DELETE CASCADE;

COMMIT;

-- Verify: expect museum_items, museum_items_locales, museum_items_rels
-- SELECT table_name FROM information_schema.tables
--  WHERE table_schema = 'public' AND table_name LIKE 'museum%';
