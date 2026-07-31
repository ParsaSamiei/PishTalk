"use client";

import * as React from "react";

import { DEFAULT_LOCALE, LOCALE_DIRECTION, type Locale } from "./config";
import { getDictionaryFor, type Dictionary } from "./dictionaries";

interface LocaleContextValue {
  readonly locale: Locale;
  readonly dictionary: Dictionary;
  readonly dir: "rtl" | "ltr";
}

const LocaleContext = React.createContext<LocaleContextValue | null>(null);

/**
 * Makes the server-resolved locale available to Client Components.
 *
 * The locale is read from the cookie on the server and passed down, so client
 * components never guess — which keeps the first client render identical to
 * the server's and avoids a hydration mismatch.
 */
export function LocaleProvider({
  locale,
  children,
}: Readonly<{ locale: Locale; children: React.ReactNode }>) {
  const value = React.useMemo<LocaleContextValue>(
    () => ({
      locale,
      dictionary: getDictionaryFor(locale),
      dir: LOCALE_DIRECTION[locale],
    }),
    [locale],
  );

  return (
    <LocaleContext.Provider value={value}>{children}</LocaleContext.Provider>
  );
}

/** Full locale context. Throws outside the provider. */
export function useLocale(): LocaleContextValue {
  const ctx = React.useContext(LocaleContext);
  if (!ctx) {
    throw new Error("useLocale must be used within a LocaleProvider");
  }
  return ctx;
}

/**
 * The active dictionary, for Client Components.
 *
 * @example
 * const d = useDictionary();
 * return <button>{d.common.share}</button>;
 */
export function useDictionary(): Dictionary {
  return useLocale().dictionary;
}

/**
 * Same as `useLocale`, but safe to call outside a provider — falls back to
 * Persian. For leaf components that may render in isolation (tests, error
 * boundaries above the provider).
 */
export function useOptionalLocale(): LocaleContextValue {
  const ctx = React.useContext(LocaleContext);
  return (
    ctx ?? {
      locale: DEFAULT_LOCALE,
      dictionary: getDictionaryFor(DEFAULT_LOCALE),
      dir: LOCALE_DIRECTION[DEFAULT_LOCALE],
    }
  );
}
