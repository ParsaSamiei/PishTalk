-- Adds an admin-approval workflow to registrations. A submission no longer
-- means "attending" by itself: it starts PENDING and only becomes APPROVED
-- once an admin reviews it from /admin/registrations, at which point
-- PishTalk sends a FarazSMS notice containing a link to a page with the
-- event's date, time, and location.
--
-- The enum is rebuilt rather than extended with ALTER TYPE ... ADD VALUE:
-- Postgres does not allow a newly added enum value to be referenced in the
-- same transaction it was added in, and Prisma applies each migration file
-- as one transaction, so an ADD VALUE + backfill in a single file is not
-- safe. Rebuilding the type is a few more lines but works atomically on
-- any supported Postgres version.
--
-- Existing rows already carry the old REGISTERED status, which meant
-- "attending" under the previous auto-accept behaviour. They are mapped to
-- APPROVED here so nobody already accepted loses their spot, and nobody is
-- retroactively dropped back to PENDING.

ALTER TYPE "RegistrationStatus" RENAME TO "RegistrationStatus_old";

CREATE TYPE "RegistrationStatus" AS ENUM ('PENDING', 'APPROVED', 'REJECTED', 'CANCELLED', 'ATTENDED');

ALTER TABLE "registrations"
  ALTER COLUMN "status" DROP DEFAULT,
  ALTER COLUMN "status" TYPE "RegistrationStatus" USING (
    CASE "status"::text
      WHEN 'REGISTERED' THEN 'APPROVED'
      ELSE "status"::text
    END
  )::"RegistrationStatus",
  ALTER COLUMN "status" SET DEFAULT 'PENDING';

DROP TYPE "RegistrationStatus_old";

-- New columns backing the review + SMS flow.
ALTER TABLE "registrations"
  ADD COLUMN "approval_token" TEXT,
  ADD COLUMN "reviewed_at"    TIMESTAMP(3),
  ADD COLUMN "reviewed_by_id" TEXT,
  ADD COLUMN "admin_note"     TEXT,
  ADD COLUMN "sms_sent_at"    TIMESTAMP(3);

-- Backfill approval_token for existing rows before it becomes required and
-- unique. pgcrypto ships with postgres:16-alpine (the image in
-- docker-compose.yml) but is enabled defensively in case this ever runs
-- against a bare image or a different managed Postgres.
CREATE EXTENSION IF NOT EXISTS "pgcrypto";
UPDATE "registrations" SET "approval_token" = gen_random_uuid()::text WHERE "approval_token" IS NULL;

ALTER TABLE "registrations"
  ALTER COLUMN "approval_token" SET NOT NULL;

CREATE UNIQUE INDEX "registrations_approval_token_key" ON "registrations"("approval_token");
CREATE INDEX "registrations_status_idx" ON "registrations"("status");

ALTER TABLE "registrations"
  ADD CONSTRAINT "registrations_reviewed_by_id_fkey"
  FOREIGN KEY ("reviewed_by_id") REFERENCES "admins"("id") ON DELETE SET NULL ON UPDATE CASCADE;
