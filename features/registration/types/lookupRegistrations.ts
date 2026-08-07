import { z } from "zod";

import { DEFAULT_LOCALE } from "@/lib/i18n/config";
import { getDictionaryFor, type Dictionary } from "@/lib/i18n/dictionaries";

/**
 * A phone number alone isn't a secret (it's also entered in plaintext by
 * anyone filling out the registration form), so lookup requires the last
 * name given at registration too. This is a light deterrent against casual
 * enumeration, not real authentication — see the note in
 * `lookupRegistrations.ts`.
 */
export function createLookupRegistrationsSchema(d: Dictionary) {
  return z.object({
    phone: z
      .string()
      .trim()
      .regex(/^09\d{9}$/, d.validation.mobileInvalid),
    lastName: z.string().trim().min(2, d.validation.lastNameMin).max(50),
  });
}

/** Persian-message schema, for callers with no locale context. */
export const lookupRegistrationsSchema = createLookupRegistrationsSchema(
  getDictionaryFor(DEFAULT_LOCALE),
);

export type LookupRegistrationsValues = z.infer<
  ReturnType<typeof createLookupRegistrationsSchema>
>;

export interface RegistrationLookupEvent {
  readonly slug: string;
  readonly title: string;
  readonly titleEn: string | null;
  /** ISO string: Server Actions can't return raw `Date` objects to Client Components. */
  readonly date: string;
  readonly startTime: string;
  readonly location: string;
  readonly locationEn: string | null;
  readonly coverImage: string | null;
}

export interface RegistrationLookupItem {
  readonly id: string;
  readonly status: "REGISTERED" | "CANCELLED" | "ATTENDED";
  /** ISO string, same reasoning as `RegistrationLookupEvent.date`. */
  readonly createdAt: string;
  readonly event: RegistrationLookupEvent;
}
