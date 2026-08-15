-- Adds the "event_speakers" table so an event can list multiple speakers
-- (up to 3-4, enforced by the admin form) instead of the single legacy
-- events.speaker_name / events.speaker_bio columns, which are left in
-- place untouched.
--
-- Only "name" is required; everything else is nullable / defaulted, so this
-- is a plain CREATE TABLE with no backfill needed. onDelete: Cascade via the
-- foreign key so deleting an event cleans up its speakers automatically,
-- matching event_timelines.

CREATE TABLE "event_speakers" (
    "id"         TEXT NOT NULL,
    "event_id"   TEXT NOT NULL,
    "name"       TEXT NOT NULL,
    "bio"        TEXT,
    "photo"      TEXT,
    "sort_order" INTEGER NOT NULL DEFAULT 0,
    "name_en"    TEXT,
    "bio_en"     TEXT,

    CONSTRAINT "event_speakers_pkey" PRIMARY KEY ("id")
);

CREATE INDEX "event_speakers_event_id_idx" ON "event_speakers"("event_id");

ALTER TABLE "event_speakers"
  ADD CONSTRAINT "event_speakers_event_id_fkey"
  FOREIGN KEY ("event_id") REFERENCES "events"("id")
  ON DELETE CASCADE ON UPDATE CASCADE;
