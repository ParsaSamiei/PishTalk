/**
 * Persian/Arabic digit normalization.
 *
 * Persian keyboards produce U+06F0-U+06F9 (۰-۹) and some Arabic layouts
 * produce U+0660-U+0669 (٠-٩). Both look like digits to the visitor but fail
 * every `/\d/` check, so a phone number typed as ۰۹۱۲۱۲۳۴۵۶۷ would be rejected
 * as invalid without this. Normalize on the way in and store Latin digits.
 *
 * Pure and dependency-free so the same function runs in the browser (react-hook
 * -form resolver) and on the server (route handler re-validation) — the two
 * must agree, or a value that passes client-side validation fails server-side.
 */

const PERSIAN_ZERO = 0x06f0;
const ARABIC_ZERO = 0x0660;

/**
 * Separators and invisible characters that survive copy-paste from banking
 * apps and SMS. Written as escapes, not literals: most are zero-width and an
 * editor would render this class as an unreviewable blank.
 *
 *   U+066C Arabic thousands separator (٬)   U+060C Arabic comma (،)
 *   U+002C Latin comma                      U+0020 space
 *   U+00A0 non-breaking space               U+200C zero-width non-joiner
 *   U+200E left-to-right mark               U+200F right-to-left mark
 */
const NOISE = /[٬،,  ‌‎‏]/g;

/** Persian ۰-۹ and Arabic-Indic ٠-٩. */
const NON_LATIN_DIGITS = /[۰-۹٠-٩]/g;

/**
 * Converts Persian and Arabic-Indic digits to Latin ones and strips grouping
 * noise. Leaves every other character untouched, so it is safe on mixed input
 * such as "IR12...".
 */
export function toEnglishDigits(value: string): string {
  return value.replace(NOISE, "").replace(NON_LATIN_DIGITS, (ch) => {
    const code = ch.codePointAt(0)!;
    const base = code >= PERSIAN_ZERO ? PERSIAN_ZERO : ARABIC_ZERO;
    return String(code - base);
  });
}

/**
 * Normalizes to Latin digits and discards everything that is not a digit.
 * Use for card numbers, SHEBA and amounts, where the visitor may type spaces,
 * dashes or separators that carry no meaning.
 */
export function digitsOnly(value: string): string {
  return toEnglishDigits(value).replace(/\D/g, "");
}
