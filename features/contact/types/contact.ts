import { z } from "zod";

import { DEFAULT_LOCALE } from "@/lib/i18n/config";
import { getDictionaryFor, type Dictionary } from "@/lib/i18n/dictionaries";

/**
 * Shared client/server validation for the contact form.
 *
 * The schema is built from a dictionary rather than declared at module scope,
 * so error messages follow the visitor's locale. Callers with locale context
 * (the form, the server action) should call the factory; everyone else can use
 * the Persian-message default below.
 */
export function createContactFormSchema(d: Dictionary) {
  return z.object({
    name: z.string().trim().min(2, d.validation.nameMin).max(100),
    email: z.string().trim().email(d.validation.emailInvalid),
    phone: z.string().trim().max(20, d.validation.phoneInvalid).optional().or(z.literal("")),
    message: z.string().trim().min(10, d.validation.messageMin).max(2000),
  });
}

/** Persian-message schema, for callers with no locale context. */
export const contactFormSchema = createContactFormSchema(
  getDictionaryFor(DEFAULT_LOCALE),
);

export type ContactFormValues = z.infer<ReturnType<typeof createContactFormSchema>>;
