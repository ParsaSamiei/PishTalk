import { DEFAULT_LOCALE, type Locale } from "./config";

/**
 * Picks the English value for a database-backed field, falling back to the
 * Persian one whenever the English column is null, undefined, or blank.
 *
 * Content is authored Persian-first: admins may leave any English field
 * empty and the site keeps working, showing Persian in its place. That makes
 * the English columns purely additive — no backfill required before shipping.
 *
 * @example
 * const title = pick(locale, event.title, event.titleEn);
 */
export function pick(
  locale: Locale,
  fa: string,
  en: string | null | undefined,
): string;
export function pick(
  locale: Locale,
  fa: string | null | undefined,
  en: string | null | undefined,
): string | null;
export function pick(
  locale: Locale,
  fa: string | null | undefined,
  en: string | null | undefined,
): string | null {
  if (locale !== DEFAULT_LOCALE) {
    const trimmed = en?.trim();
    if (trimmed) return trimmed;
  }
  return fa ?? null;
}
