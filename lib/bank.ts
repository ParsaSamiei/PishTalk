import { digitsOnly, toEnglishDigits } from "@/lib/digits";

/**
 * Iranian bank card and SHEBA (IBAN) normalization, validation and display
 * formatting.
 *
 * Pure and dependency-free: the same rules run in the admin form's resolver
 * and in the server action that persists them, so a value can never pass one
 * and fail the other.
 *
 * Storage format is normalized and separator-free — 16 bare digits for a card,
 * "IR" + 24 digits for a SHEBA. Grouping is applied at render time only, so
 * the stored value stays directly comparable and copyable.
 */

const CARD_LENGTH = 16;
const SHEBA_DIGITS = 24;

/** Strips spaces, dashes and Persian digits, leaving at most 16 bare digits. */
export function normalizeCardNumber(value: string): string {
  return digitsOnly(value);
}

/**
 * Iranian debit cards are 16 digits and Luhn-valid, so a single mistyped or
 * transposed digit is caught here rather than by a supporter's failed
 * transfer. Worth validating: this number is what people send money to.
 */
export function isValidCardNumber(value: string): boolean {
  const digits = normalizeCardNumber(value);
  if (digits.length !== CARD_LENGTH) return false;

  let sum = 0;
  for (let i = 0; i < CARD_LENGTH; i += 1) {
    let digit = Number(digits[CARD_LENGTH - 1 - i]);
    // Double every second digit from the right; a result above 9 has its
    // digits summed, which for a single doubling is the same as subtracting 9.
    if (i % 2 === 1) {
      digit *= 2;
      if (digit > 9) digit -= 9;
    }
    sum += digit;
  }
  return sum % 10 === 0;
}

/**
 * Accepts "IR..." in any case, with or without spaces, and also a bare 24
 * digits (banking apps often display the number without the country prefix)
 * by prepending "IR".
 */
export function normalizeSheba(value: string): string {
  const cleaned = toEnglishDigits(value).replace(/[\s-]/g, "").toUpperCase();
  const withoutPrefix = cleaned.startsWith("IR") ? cleaned.slice(2) : cleaned;
  if (withoutPrefix.length === 0) return "";
  return `IR${withoutPrefix}`;
}

/**
 * IBAN mod-97 check (ISO 13616): move the first four characters to the end,
 * replace letters with their position value + 9 (I=18, R=27), and require the
 * whole number to be congruent to 1 modulo 97.
 *
 * The modulo is folded digit by digit rather than built into one big integer:
 * the running remainder stays below 97, so `remainder * 10 + digit` never
 * approaches Number.MAX_SAFE_INTEGER and no BigInt is needed.
 */
export function isValidSheba(value: string): boolean {
  const sheba = normalizeSheba(value);
  if (!/^IR\d{24}$/.test(sheba)) return false;

  const rearranged = sheba.slice(4) + sheba.slice(0, 4);

  let remainder = 0;
  for (const ch of rearranged) {
    const chunk = /\d/.test(ch)
      ? ch
      : String(ch.charCodeAt(0) - 55); // 'A' (65) -> 10 ... 'Z' (90) -> 35
    for (const digit of chunk) {
      remainder = (remainder * 10 + Number(digit)) % 97;
    }
  }
  return remainder === 1;
}

/** Groups a stored card number as 4-4-4-4 for display. Never for storage. */
export function formatCardNumber(value: string): string {
  const digits = normalizeCardNumber(value);
  return digits.replace(/(\d{4})(?=\d)/g, "$1 ");
}

/** Groups a stored SHEBA as "IR12 3456 ..." for display. Never for storage. */
export function formatSheba(value: string): string {
  const sheba = normalizeSheba(value);
  if (!sheba) return "";
  return sheba.replace(/(.{4})(?=.)/g, "$1 ");
}

export const BANK_CONSTANTS = {
  CARD_LENGTH,
  SHEBA_DIGITS,
} as const;
