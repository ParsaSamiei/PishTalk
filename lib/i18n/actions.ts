"use server";

import { cookies } from "next/headers";
import { revalidatePath } from "next/cache";

import { LOCALE_COOKIE, LOCALE_COOKIE_MAX_AGE, resolveLocale } from "./config";

/**
 * Persists the chosen locale and re-renders the current tree.
 *
 * Every page reads the locale cookie, so the whole layout (including the
 * `dir` attribute on <html>) must re-render — hence `revalidatePath` with
 * "layout" scope rather than a plain `router.refresh()`.
 */
export async function setLocaleAction(value: string): Promise<void> {
  const locale = resolveLocale(value);
  const store = await cookies();

  store.set(LOCALE_COOKIE, locale, {
    maxAge: LOCALE_COOKIE_MAX_AGE,
    path: "/",
    sameSite: "lax",
    // No client script reads this; the server does. Kept non-httpOnly only
    // so the choice survives a client-side hydration check if one is added.
    httpOnly: false,
  });

  revalidatePath("/", "layout");
}
