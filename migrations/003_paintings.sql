-- Gallery paintings (collection `paintings`).
--
-- Same reasoning as 001_museum_items.sql: schema push is off (see
-- payload.config.ts), so the tables Payload would generate are created here by
-- hand, in the same three-table shape:
--   paintings          scalar fields + single relations (main image)
--   paintings_locales  localized fields (title, description)
--   paintings_rels     hasMany relations (the extra gallery photos)
--
-- Unlike 001 this also adds the `payload_locked_documents_rels` column up
-- front — omitting it was the bug 002_museum_locked_documents.sql had to fix
-- afterwards (deleting a document failed with "column ... does not exist").
--
-- Purely additive: no existing table or row is touched. Safe to run once.

BEGIN;

-- 1. Enumerated field values ------------------------------------------------
CREATE TYPE enum_paintings_work_type AS ENUM (
  'oil', 'acrylic', 'watercolor', 'graphics', 'mixed', 'print'
);

CREATE TYPE enum_paintings_material AS ENUM (
  'canvas', 'canvas_on_board', 'paper', 'wood'
);

-- 2. Main table --------------------------------------------------------------
CREATE TABLE paintings (
  id            serial PRIMARY KEY,
  main_image_id integer,
  size          character varying NOT NULL,
  work_type     enum_paintings_work_type NOT NULL,
  material      enum_paintings_material NOT NULL,
  price         numeric(10,2) NOT NULL,
  updated_at    timestamp(3) with time zone DEFAULT now() NOT NULL,
  created_at    timestamp(3) with time zone DEFAULT now() NOT NULL
);

CREATE INDEX paintings_main_image_idx ON paintings USING btree (main_image_id);
CREATE INDEX paintings_updated_at_idx ON paintings USING btree (updated_at);
CREATE INDEX paintings_created_at_idx ON paintings USING btree (created_at);

-- Deleting a photo must not delete the painting itself.
ALTER TABLE paintings
  ADD CONSTRAINT paintings_main_image_fk
  FOREIGN KEY (main_image_id) REFERENCES media(id) ON DELETE SET NULL;

-- 3. Localized fields (EN / RU) ----------------------------------------------
CREATE TABLE paintings_locales (
  id          serial PRIMARY KEY,
  title       character varying NOT NULL,
  description jsonb,
  _locale     _locales NOT NULL,
  _parent_id  integer NOT NULL
);

CREATE UNIQUE INDEX paintings_locales_locale_parent_id_unique
  ON paintings_locales USING btree (_locale, _parent_id);

ALTER TABLE paintings_locales
  ADD CONSTRAINT paintings_locales_parent_id_fk
  FOREIGN KEY (_parent_id) REFERENCES paintings(id) ON DELETE CASCADE;

-- 4. Extra gallery photos (hasMany upload) -----------------------------------
CREATE TABLE paintings_rels (
  id        serial PRIMARY KEY,
  "order"   integer,
  parent_id integer NOT NULL,
  path      character varying NOT NULL,
  media_id  integer
);

CREATE INDEX paintings_rels_order_idx    ON paintings_rels USING btree ("order");
CREATE INDEX paintings_rels_parent_idx   ON paintings_rels USING btree (parent_id);
CREATE INDEX paintings_rels_path_idx     ON paintings_rels USING btree (path);
CREATE INDEX paintings_rels_media_id_idx ON paintings_rels USING btree (media_id);

ALTER TABLE paintings_rels
  ADD CONSTRAINT paintings_rels_parent_fk
  FOREIGN KEY (parent_id) REFERENCES paintings(id) ON DELETE CASCADE;

ALTER TABLE paintings_rels
  ADD CONSTRAINT paintings_rels_media_fk
  FOREIGN KEY (media_id) REFERENCES media(id) ON DELETE CASCADE;

-- 5. Admin document locking --------------------------------------------------
ALTER TABLE payload_locked_documents_rels
  ADD COLUMN IF NOT EXISTS paintings_id integer;

CREATE INDEX IF NOT EXISTS payload_locked_documents_rels_paintings_id_idx
  ON payload_locked_documents_rels USING btree (paintings_id);

ALTER TABLE payload_locked_documents_rels
  ADD CONSTRAINT payload_locked_documents_rels_paintings_fk
  FOREIGN KEY (paintings_id) REFERENCES paintings(id) ON DELETE CASCADE;

COMMIT;

-- Verify: expect paintings, paintings_locales, paintings_rels
-- SELECT table_name FROM information_schema.tables
--  WHERE table_schema = 'public' AND table_name LIKE 'painting%';
