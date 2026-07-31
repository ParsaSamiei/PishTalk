import { DEFAULT_LOCALE, LOCALE_HTML_LANG, type Locale } from "@/lib/i18n/config";

/**
 * Date formatting differs between the locales by more than language: Persian
 * uses the Jalali calendar ("۱۴ خرداد ۱۴۰۴"), English the Gregorian one
 * ("4 June 2025"). `Intl` handles both given the right tag — "fa-IR" selects
 * the Persian calendar automatically.
 *
 * `locale` defaults to Persian so the admin panel (which stays Persian) and
 * any other caller can omit it.
 *
 * Formatters are cached per locale: constructing an `Intl.DateTimeFormat` is
 * relatively expensive and these run inside list renders.
 */

const DATE_FORMATTERS = new Map<Locale, Intl.DateTimeFormat>();
const WEEKDAY_FORMATTERS = new Map<Locale, Intl.DateTimeFormat>();

function getFormatter(
  cache: Map<Locale, Intl.DateTimeFormat>,
  locale: Locale,
  options: Intl.DateTimeFormatOptions,
): Intl.DateTimeFormat {
  let formatter = cache.get(locale);
  if (!formatter) {
    formatter = new Intl.DateTimeFormat(LOCALE_HTML_LANG[locale], options);
    cache.set(locale, formatter);
  }
  return formatter;
}

/**
 * Formats a date in the locale's calendar — Jalali for Persian
 * ("۱۴ خرداد ۱۴۰۴"), Gregorian for English ("4 June 2025").
 */
export function formatEventDate(
  date: Date,
  locale: Locale = DEFAULT_LOCALE,
): string {
  return getFormatter(DATE_FORMATTERS, locale, {
    year: "numeric",
    month: "long",
    day: "numeric",
  }).format(date);
}

/**
 * Returns the weekday name in the active locale, e.g. "چهارشنبه" / "Wednesday".
 */
export function formatWeekday(
  date: Date,
  locale: Locale = DEFAULT_LOCALE,
): string {
  return getFormatter(WEEKDAY_FORMATTERS, locale, {
    weekday: "long",
  }).format(date);
}
