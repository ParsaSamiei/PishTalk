/**
 * Locale configuration for the bilingual (Persian / English) site.
 *
 * The active locale lives in a cookie rather than the URL — see
 * `docs/i18n.md`. That keeps every existing Persian URL intact, at the cost
 * of per-locale SEO and shareable English links.
 */

export const LOCALES = ["fa", "en"] as const;

export type Locale = (typeof LOCALES)[number];

export const DEFAULT_LOCALE: Locale = "fa";

/** Cookie holding the visitor's chosen locale. Readable by the server. */
export const LOCALE_COOKIE = "locale";

/** One year, in seconds. */
export const LOCALE_COOKIE_MAX_AGE = 60 * 60 * 24 * 365;

/** Writing direction per locale, for the `dir` attribute on <html>. */
export const LOCALE_DIRECTION: Record<Locale, "rtl" | "ltr"> = {
  fa: "rtl",
  en: "ltr",
};

/** BCP 47 tags, used for `lang` and for Intl formatters. */
export const LOCALE_HTML_LANG: Record<Locale, string> = {
  fa: "fa-IR",
  en: "en",
};

/** OpenGraph `og:locale` values. */
export const LOCALE_OG: Record<Locale, string> = {
  fa: "fa_IR",
  en: "en_US",
};

/** Native language names, for the language switcher. */
export const LOCALE_NAMES: Record<Locale, string> = {
  fa: "فارسی",
  en: "English",
};

/** Short labels for the compact switcher button. */
export const LOCALE_SHORT_LABELS: Record<Locale, string> = {
  fa: "FA",
  en: "EN",
};

export function isLocale(value: unknown): value is Locale {
  return typeof value === "string" && (LOCALES as readonly string[]).includes(value);
}

/**
 * Normalises anything (cookie value, header fragment) to a supported locale,
 * falling back to Persian.
 */
export function resolveLocale(value: string | undefined | null): Locale {
  return isLocale(value) ? value : DEFAULT_LOCALE;
}
