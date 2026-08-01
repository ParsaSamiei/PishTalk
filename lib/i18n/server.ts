import "server-only";

import { cookies } from "next/headers";

import {
  DEFAULT_LOCALE,
  LOCALE_COOKIE,
  LOCALE_DIRECTION,
  LOCALE_HTML_LANG,
  resolveLocale,
  type Locale,
} from "./config";
import { getDictionaryFor, type Dictionary } from "./dictionaries";

/**
 * Resolves the visitor's locale: the cookie if the visitor has chosen one,
 * otherwise Persian.
 *
 * Persian is unconditional for a first visit. `Accept-Language` is
 * deliberately not consulted — see the note in the body.
 *
 * Calling this opts the route into dynamic rendering, which is the price of
 * cookie-based locale selection (there is no URL segment to vary on).
 */
export async function getLocale(): Promise<Locale> {
  try {
    const store = await cookies();
    const cookieValue = store.get(LOCALE_COOKIE)?.value;
    if (cookieValue) return resolveLocale(cookieValue);

    // No cookie set: Persian is the true default. We used to check
    // Accept-Language here, but that meant English browsers landed on English,
    // which isn't the intended default experience. Visitors who want English
    // can flip the toggle.
    return DEFAULT_LOCALE;
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
