-- Adds English translation columns alongside the existing Persian ones.
--
-- Every column is nullable with no default: content stays Persian-first and
-- the application falls back to the Persian column whenever the English one
-- is null or blank (see lib/i18n/content.ts). Nothing needs backfilling, and
-- this migration is safe to run against a populated database.
--
-- ADD COLUMN of a nullable column takes only a brief catalog lock in
-- PostgreSQL (no table rewrite), so this is safe on a live database.

-- events
ALTER TABLE "events"
  ADD COLUMN "title_en"           TEXT,
  ADD COLUMN "subtitle_en"        TEXT,
  ADD COLUMN "description_en"     TEXT,
  ADD COLUMN "location_en"        TEXT,
  ADD COLUMN "speaker_name_en"    TEXT,
  ADD COLUMN "speaker_bio_en"     TEXT,
  ADD COLUMN "seo_title_en"       TEXT,
  ADD COLUMN "seo_description_en" TEXT;

-- event_timelines
ALTER TABLE "event_timelines"
  ADD COLUMN "title_en"       TEXT,
  ADD COLUMN "description_en" TEXT;

-- categories
ALTER TABLE "categories"
  ADD COLUMN "name_en"        TEXT,
  ADD COLUMN "description_en" TEXT;

-- blogs
ALTER TABLE "blogs"
  ADD COLUMN "title_en"           TEXT,
  ADD COLUMN "excerpt_en"         TEXT,
  ADD COLUMN "content_en"         TEXT,
  ADD COLUMN "seo_title_en"       TEXT,
  ADD COLUMN "seo_description_en" TEXT;

-- galleries
ALTER TABLE "galleries"
  ADD COLUMN "title_en"       TEXT,
  ADD COLUMN "description_en" TEXT;

-- gallery_media
ALTER TABLE "gallery_media"
  ADD COLUMN "caption_en" TEXT;

-- resources
ALTER TABLE "resources"
  ADD COLUMN "title_en"       TEXT,
  ADD COLUMN "description_en" TEXT;

-- faqs
ALTER TABLE "faqs"
  ADD COLUMN "question_en" TEXT,
  ADD COLUMN "answer_en"   TEXT;

-- rules
ALTER TABLE "rules"
  ADD COLUMN "title_en"       TEXT,
  ADD COLUMN "description_en" TEXT;

-- site_settings
ALTER TABLE "site_settings"
  ADD COLUMN "site_name_en"       TEXT,
  ADD COLUMN "tagline_en"         TEXT,
  ADD COLUMN "description_en"     TEXT,
  ADD COLUMN "hero_title_en"      TEXT,
  ADD COLUMN "hero_subtitle_en"   TEXT,
  ADD COLUMN "address_en"         TEXT,
  ADD COLUMN "copyright_en"       TEXT,
  ADD COLUMN "seo_title_en"       TEXT,
  ADD COLUMN "seo_description_en" TEXT;
