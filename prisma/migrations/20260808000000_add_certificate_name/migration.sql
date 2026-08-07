-- Adds a Latin-script name column used for printing certificates of
-- attendance.
--
-- firstName/lastName can be typed in either Persian or Latin script
-- (nothing about the form constrains this). certificate_name is only
-- populated when the visitor's name was detected as Persian script at
-- submission time; for existing/Latin-script rows it stays NULL, and the
-- app falls back to firstName/lastName directly when generating
-- certificates (see resolveCertificateName in
-- features/registration/types/registration.ts).
--
-- Nullable, no default: safe ADD COLUMN on a live database, no backfill
-- required. Existing rows are unaffected; certificates for already-collected
-- Persian-script registrations will need certificate_name filled in
-- manually (or via a follow-up admin/email flow) before they can be
-- generated correctly.

ALTER TABLE "registrations"
  ADD COLUMN "certificate_name" TEXT;
