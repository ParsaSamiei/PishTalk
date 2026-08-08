-- Adds bank-transfer support: the institute's payment details on /support and
-- the receipt images visitors upload after transferring money.
--
-- "support_receipts" is bookkeeping only. Approving a receipt does NOT create
-- a row in "sponsors" -- the public supporters grid is unaffected.
--
-- "receipt_file" holds a bare UUID filename, never a path or URL. The images
-- live outside public/ (see lib/receipt-storage.ts) because that directory is
-- served without authentication by app/uploads/[...path]/route.ts.
--
-- Every new site_settings column is nullable or defaulted, so this is
-- non-destructive on an existing database and needs no backfill.

CREATE TYPE "SupportReceiptStatus" AS ENUM ('PENDING', 'APPROVED', 'REJECTED');

CREATE TABLE "support_receipts" (
    "id"             TEXT NOT NULL,
    "full_name"      TEXT NOT NULL,
    "phone"          TEXT NOT NULL,
    "amount_toman"   INTEGER NOT NULL,
    "receipt_file"   TEXT NOT NULL,
    "status"         "SupportReceiptStatus" NOT NULL DEFAULT 'PENDING',
    "admin_note"     TEXT,
    "reviewed_at"    TIMESTAMP(3),
    "reviewed_by_id" TEXT,
    "created_at"     TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at"     TIMESTAMP(3) NOT NULL,

    CONSTRAINT "support_receipts_pkey" PRIMARY KEY ("id")
);

CREATE INDEX "support_receipts_status_idx" ON "support_receipts"("status");
CREATE INDEX "support_receipts_created_at_idx" ON "support_receipts"("created_at");
CREATE INDEX "support_receipts_phone_idx" ON "support_receipts"("phone");

-- SET NULL rather than CASCADE: deleting an admin account must not delete the
-- financial records they happened to review.
ALTER TABLE "support_receipts"
    ADD CONSTRAINT "support_receipts_reviewed_by_id_fkey"
    FOREIGN KEY ("reviewed_by_id") REFERENCES "admins"("id")
    ON DELETE SET NULL ON UPDATE CASCADE;

ALTER TABLE "site_settings"
    ADD COLUMN "support_payment_enabled" BOOLEAN NOT NULL DEFAULT false,
    ADD COLUMN "support_card_number"     TEXT,
    ADD COLUMN "support_card_holder"     TEXT,
    ADD COLUMN "support_sheba"           TEXT;
