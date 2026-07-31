import type { Locale } from "../config";
import { fa } from "./fa";
import { en } from "./en";
import type { Dictionary } from "./types";

export type { Dictionary };

const DICTIONARIES: Record<Locale, Dictionary> = { fa, en };

/**
 * Returns the dictionary for a locale.
 *
 * Both dictionaries are plain objects bundled at build time — small enough
 * that lazy-loading them per request would cost more than it saves.
 */
export function getDictionaryFor(locale: Locale): Dictionary {
  return DICTIONARIES[locale];
}
