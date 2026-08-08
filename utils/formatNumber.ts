import { DEFAULT_LOCALE, LOCALE_HTML_LANG, type Locale } from "@/lib/i18n/config";

/**
 * Number formatting for money.
 *
 * Persian renders both the digits and the grouping separator differently
 * ("۵۰۰٬۰۰۰" vs "500,000"), and `Intl` handles both given the right tag.
 * Mirrors the formatter-cache approach in utils/formatDate.ts: constructing an
 * `Intl.NumberFormat` is relatively expensive and these run inside list rows.
 *
 * `locale` defaults to Persian so the admin panel — which stays Persian
 * regardless of the visitor's locale — can omit it.
 */

const NUMBER_FORMATTERS = new Map<Locale, Intl.NumberFormat>();

function getFormatter(locale: Locale): Intl.NumberFormat {
  let formatter = NUMBER_FORMATTERS.get(locale);
  if (!formatter) {
    formatter = new Intl.NumberFormat(LOCALE_HTML_LANG[locale]);
    NUMBER_FORMATTERS.set(locale, formatter);
  }
  return formatter;
}

/** Groups a number in the active locale's digits, e.g. "۵۰۰٬۰۰۰" / "500,000". */
export function formatNumber(
  value: number,
  locale: Locale = DEFAULT_LOCALE,
): string {
  return getFormatter(locale).format(value);
}
