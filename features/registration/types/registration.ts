import { z } from "zod";

import { DEFAULT_LOCALE } from "@/lib/i18n/config";
import { getDictionaryFor, type Dictionary } from "@/lib/i18n/dictionaries";

/**
 * Persian (and Arabic-block-shared) letters. Used to decide, from the raw
 * value the visitor typed, whether firstName/lastName are Persian script —
 * independent of which language the site UI itself is in. Someone can
 * browse the English site and still type a Persian name, and vice versa.
 */
const PERSIAN_SCRIPT_RE = /[\u0600-\u06FF]/;

/** Latin letters, spaces, apostrophes, and hyphens only — no digits/symbols. */
const LATIN_NAME_RE = /^[A-Za-z][A-Za-z\s'-]*$/;

export function isPersianScript(value: string): boolean {
  return PERSIAN_SCRIPT_RE.test(value);
}

/**
 * Built from a dictionary so validation messages match the visitor's locale.
 * The `09…` regex is the Iranian mobile format and is locale-independent —
 * only its message changes.
 *
 * certificateName is conditionally required: if firstName or lastName was
 * typed in Persian script, we have no Latin rendering to print on a
 * certificate of attendance, so we require one explicitly. If the visitor
 * already typed a Latin name, it's used as-is and this field stays unused.
 */
export function createRegistrationFormSchema(d: Dictionary) {
  return z
    .object({
      firstName: z.string().trim().min(2, d.validation.nameMin).max(50),
      lastName: z.string().trim().min(2, d.validation.lastNameMin).max(50),
      certificateName: z
        .string()
        .trim()
        .max(100)
        .regex(LATIN_NAME_RE, d.validation.certificateNameInvalid)
        .optional()
        .or(z.literal("")),
      phone: z
        .string()
        .trim()
        .regex(/^09\d{9}$/, d.validation.mobileInvalid),
      email: z.string().trim().email(d.validation.emailInvalid).optional().or(z.literal("")),
      university: z.string().trim().max(150).optional().or(z.literal("")),
      company: z.string().trim().max(150).optional().or(z.literal("")),
      profession: z.string().trim().max(150).optional().or(z.literal("")),
      // Required, unlike the other optional fields above: this is the
      // visitor's own account of their work and why they want to attend,
      // used by admins to screen registrations before approving them (see
      // the hint text next to the field). A short min length is enough to
      // rule out empty/one-word submissions without being a real barrier.
      notes: z.string().trim().min(30, d.validation.notesMin).max(500, d.validation.notesMax),
      // Attendance eligibility acknowledgement. Not persisted — it exists
      // only to make the visitor affirm the requirement before submitting,
      // so it is validated but never written to the Registration row.
      // Required-ness lives in the superRefine below rather than a field-level
      // .refine(), which would narrow the inferred type to `true` and break
      // the form's `boolean` input type.
      eligibilityConfirmed: z.boolean().optional(),
    })
    .superRefine((values, ctx) => {
      const needsCertificateName =
        isPersianScript(values.firstName) || isPersianScript(values.lastName);

      if (needsCertificateName && !values.certificateName) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          path: ["certificateName"],
          message: d.validation.certificateNameRequired,
        });
      }

      if (values.eligibilityConfirmed !== true) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          path: ["eligibilityConfirmed"],
          message: d.validation.eligibilityRequired,
        });
      }
    });
}

/** Persian-message schema, for callers with no locale context. */
export const registrationFormSchema = createRegistrationFormSchema(
  getDictionaryFor(DEFAULT_LOCALE),
);

export type RegistrationFormValues = z.infer<
  ReturnType<typeof createRegistrationFormSchema>
>;

/**
 * The Latin-script name to print on a certificate of attendance: the
 * explicit certificateName if one was collected, otherwise firstName/
 * lastName themselves (already Latin, since certificateName is only
 * required when they weren't).
 */
export function resolveCertificateName(registration: {
  firstName: string;
  lastName: string;
  certificateName: string | null;
}): string {
  return registration.certificateName || `${registration.firstName} ${registration.lastName}`;
}
