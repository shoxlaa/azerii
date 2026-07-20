-- Completes 001_museum_items.sql.
--
-- Payload keeps a `payload_locked_documents_rels` table with one column per
-- collection, used for document locking in the admin. 001 created the museum
-- tables but not this column, so any admin operation that checks locks (e.g.
-- deleting an exhibit) failed with:
--   column "museum_items_id" does not exist
--
-- Mirrors the existing `products_id` column exactly. Additive and safe.
-- (`payload_preferences_rels` needs no change — preferences relate only to users.)

BEGIN;

ALTER TABLE payload_locked_documents_rels
  ADD COLUMN IF NOT EXISTS museum_items_id integer;

CREATE INDEX IF NOT EXISTS payload_locked_documents_rels_museum_items_id_idx
  ON payload_locked_documents_rels USING btree (museum_items_id);

ALTER TABLE payload_locked_documents_rels
  ADD CONSTRAINT payload_locked_documents_rels_museum_items_fk
  FOREIGN KEY (museum_items_id) REFERENCES museum_items(id) ON DELETE CASCADE;

COMMIT;
