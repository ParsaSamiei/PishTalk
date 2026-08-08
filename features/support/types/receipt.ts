import { z } from "zod";

import { digitsOnly, toEnglishDigits } from "@/lib/digits";
import { DEFAULT_LOCALE } from "@/lib/i18n/config";
import { getDictionaryFor, type Dictionary } from "@/lib/i18n/dictionaries";

/**
 * Shared client/server validation for the public receipt submission form.
 *
 * Built from a dictionary rather than declared at module scope so error
 * messages follow the visitor's locale — same pattern as
 * features/contact/types/contact.ts.
 *
 * The receipt File is deliberately NOT part of this schema. A File cannot be
 * validated meaningfully by its metadata: `file.type` is supplied by the
 * browser and is trivially forged by a direct POST. It is checked in the route
 * by actually decoding it (lib/decodeImage.ts), with the constants below used
 * only for a friendly client-side pre-check before upload.
 */

export const RECEIPT_MAX_BYTES = 6 * 1024 * 1024;
export const RECEIPT_ALLOWED_TYPES = [
  "image/jpeg",
  "image/png",
  "image/webp",
] as const;

/** Smallest transfer worth recording; also rejects a stray "0" or "1". */
const MIN_AMOUNT_TOMAN = 1_000;
/** Guards the Int column rather than expressing a real business limit. */
const MAX_AMOUNT_TOMAN = 1_000_000_000;

export function createReceiptFormSchema(d: Dictionary) {
  return z.object({
    fullName: z.string().trim().min(2, d.validation.nameMin).max(100),
    // Persian keyboards produce ۰۹۱۲…, which fails /^09\d{9}$/ until
    // normalized. Doing it in the transform means the client resolver and the
    // server re-validation apply the identical rule.
    phone: z
      .string()
      .transform((value) => toEnglishDigits(value).trim())
      .pipe(z.string().regex(/^09\d{9}$/, d.validation.mobileInvalid)),
    amountToman: z
      .string()
      .transform((value) => Number(digitsOnly(value)))
      .pipe(
        z
          .number()
          .int()
          .min(MIN_AMOUNT_TOMAN, d.validation.amountMin)
          .max(MAX_AMOUNT_TOMAN, d.validation.amountMax),
      ),
    /**
     * Honeypot. Hidden from sighted users and from assistive technology, so
     * only a bot that fills every field will set it. Must stay empty.
     */
    website: z.string().max(0).optional(),
  });
}

/** Persian-message schema, for callers with no locale context. */
export const receiptFormSchema = createReceiptFormSchema(
  getDictionaryFor(DEFAULT_LOCALE),
);

export type ReceiptFormValues = z.output<ReturnType<typeof createReceiptFormSchema>>;
export type ReceiptFormInput = z.input<ReturnType<typeof createReceiptFormSchema>>;
