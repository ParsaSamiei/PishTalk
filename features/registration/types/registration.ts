import { z } from "zod";

import { DEFAULT_LOCALE } from "@/lib/i18n/config";
import { getDictionaryFor, type Dictionary } from "@/lib/i18n/dictionaries";

/**
 * Built from a dictionary so validation messages match the visitor's locale.
 * The `09…` regex is the Iranian mobile format and is locale-independent —
 * only its message changes.
 */
export function createRegistrationFormSchema(d: Dictionary) {
  return z.object({
    firstName: z.string().trim().min(2, d.validation.nameMin).max(50),
    lastName: z.string().trim().min(2, d.validation.lastNameMin).max(50),
    phone: z
      .string()
      .trim()
      .regex(/^09\d{9}$/, d.validation.mobileInvalid),
    email: z.string().trim().email(d.validation.emailInvalid).optional().or(z.literal("")),
    university: z.string().trim().max(150).optional().or(z.literal("")),
    company: z.string().trim().max(150).optional().or(z.literal("")),
    profession: z.string().trim().max(150).optional().or(z.literal("")),
    notes: z.string().trim().max(500).optional().or(z.literal("")),
  });
}

/** Persian-message schema, for callers with no locale context. */
export const registrationFormSchema = createRegistrationFormSchema(
  getDictionaryFor(DEFAULT_LOCALE),
);

export type RegistrationFormValues = z.infer<
  ReturnType<typeof createRegistrationFormSchema>
>;
