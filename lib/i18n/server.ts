import "server-only";

import { cookies, headers } from "next/headers";

import {
  DEFAULT_LOCALE,
  LOCALE_COOKIE,
  LOCALE_DIRECTION,
  LOCALE_HTML_LANG,
  localeFromAcceptLanguage,
  resolveLocale,
  type Locale,
} from "./config";
import { getDictionaryFor, type Dictionary } from "./dictionaries";

/**
 * Resolves the visitor's locale: the cookie wins, and a visitor who has never
 * chosen one falls back to their browser's `Accept-Language` preference.
 *
 * The cookie is checked first so an explicit choice always beats the header —
 * an English speaker who deliberately switches to Persian must stay in
 * Persian on the next request.
 *
 * Calling this opts the route into dynamic rendering, which is the price of
 * cookie-based locale selection (there is no URL segment to vary on).
 */
export async function getLocale(): Promise<Locale> {
  try {
    const store = await cookies();
    const cookieValue = store.get(LOCALE_COOKIE)?.value;
    if (cookieValue) return resolveLocale(cookieValue);

    const headerList = await headers();
    return (
      localeFromAcceptLanguage(headerList.get("accept-language")) ??
      DEFAULT_LOCALE
    );
  } catch {
    // `cookies()`/`headers()` throw outside a request scope (e.g. while
    // prerendering a fully static route). Persian is the site default, so
    // fall back rather than crash.
    return DEFAULT_LOCALE;
  }
}

/** Returns the active locale's dictionary, for use in Server Components. */
export async function getDictionary(): Promise<Dictionary> {
  return getDictionaryFor(await getLocale());
}

/**
 * Convenience for layouts and metadata: locale plus everything derived from
 * it, in one await.
 */
export async function getLocaleContext(): Promise<{
  locale: Locale;
  dictionary: Dictionary;
  dir: "rtl" | "ltr";
  lang: string;
}> {
  const locale = await getLocale();
  return {
    locale,
    dictionary: getDictionaryFor(locale),
    dir: LOCALE_DIRECTION[locale],
    lang: LOCALE_HTML_LANG[locale],
  };
}
