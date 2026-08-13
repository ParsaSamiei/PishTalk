-- Lets an admin turn off the automatic FarazSMS approval notice from
-- /admin/settings without touching the review workflow itself: approving a
-- registration still works and still generates the approvalToken link, the
-- toggle only decides whether reviewRegistration() calls FarazSMS or leaves
-- it for the admin to send manually (see registrationActions.ts and
-- RegistrationReviewActions.tsx's copy-link fallback).

ALTER TABLE "site_settings" ADD COLUMN "sms_approval_enabled" BOOLEAN NOT NULL DEFAULT true;
