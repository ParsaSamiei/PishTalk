-- Adds the "sponsors" table backing the public /support page.
--
-- This is separate from the footer's SPONSORS list (lib/sponsors.ts, still
-- a hardcoded array) -- that one is left untouched. This table only feeds
-- /support and /admin/sponsors.
--
-- Everything but "name" is nullable / has a default, so this is a plain
-- CREATE TABLE with no backfill needed.

CREATE TABLE "sponsors" (
    "id"             TEXT NOT NULL,
    "name"           TEXT NOT NULL,
    "logo"           TEXT,
    "url"            TEXT,
    "description"    TEXT,
    "description_en" TEXT,
    "sort_order"     INTEGER NOT NULL DEFAULT 0,
    "published"      BOOLEAN NOT NULL DEFAULT true,
    "created_at"     TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at"     TIMESTAMP(3) NOT NULL,

    CONSTRAINT "sponsors_pkey" PRIMARY KEY ("id")
);

CREATE INDEX "sponsors_sort_order_idx" ON "sponsors"("sort_order");
