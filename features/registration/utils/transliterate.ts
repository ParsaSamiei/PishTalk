/**
 * Rough Persian → Latin transliteration, used only to pre-fill the
 * certificate-name field as an editable suggestion.
 *
 * Persian romanization is genuinely ambiguous (e.g. "Mohammad" vs
 * "Muhammad" vs "Mohammd", vowels that aren't written in the Persian
 * script at all), so this is intentionally simple and NOT treated as
 * authoritative anywhere — the visitor always sees and can edit the
 * result before it's stored, and the server never trusts it as-is
 * (see LATIN_NAME_RE / certificateName validation in registration.ts).
 */
const LETTER_MAP: Record<string, string> = {
  "آ": "A",
  "ا": "a",
  "ب": "b",
  "پ": "p",
  "ت": "t",
  "ث": "s",
  "ج": "j",
  "چ": "ch",
  "ح": "h",
  "خ": "kh",
  "د": "d",
  "ذ": "z",
  "ر": "r",
  "ز": "z",
  "ژ": "zh",
  "س": "s",
  "ش": "sh",
  "ص": "s",
  "ض": "z",
  "ط": "t",
  "ظ": "z",
  "ع": "a",
  "غ": "gh",
  "ف": "f",
  "ق": "gh",
  "ک": "k",
  "گ": "g",
  "ل": "l",
  "م": "m",
  "ن": "n",
  "و": "v",
  "ه": "h",
  "ی": "y",
  "ء": "",
  "ئ": "y",
  " ": " ",
  "‌": " ", // ZWNJ -> space
};

/** Best-effort transliteration; always meant to be reviewed/edited by the user. */
export function transliteratePersianName(value: string): string {
  const raw = Array.from(value)
    .map((ch) => LETTER_MAP[ch] ?? ch)
    .join("");

  // Collapse repeated letters produced by multi-char mappings (e.g. "sh"+"sh")
  // and title-case each word for a certificate-appropriate look.
  return raw
    .split(/\s+/)
    .filter(Boolean)
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");
}
