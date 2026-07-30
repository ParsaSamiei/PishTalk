import "server-only";
import { JSDOM } from "jsdom";
import createDOMPurify from "isomorphic-dompurify";
import type { Config } from "isomorphic-dompurify";

import { SITE_URL } from "@/lib/constants";

/**
 * isomorphic-dompurify's default export lazily builds its own jsdom window
 * with `new JSDOM()`, which has no base URL and defaults to "about:blank".
 *
 * Blog content (and the site-settings Maps embed) can contain root-relative
 * URLs — e.g. "/uploads/blog/<uuid>.jpg", exactly what /api/admin/upload
 * returns, or whatever an admin pastes into the rich-text editor's "Add
 * Image"/"Add Link" prompts. Resolving a "/"-prefixed path against
 * "about:blank" is not valid per the URL spec (it has no hierarchical
 * structure to resolve against), so jsdom throws while parsing the HTML —
 * "The string did not match the expected pattern." — before any try/catch
 * around the database call even runs. It has nothing to do with the DB,
 * which is why the same code can misbehave inconsistently: it only
 * reproduces when the saved content happens to contain a root-relative
 * URL, not every time the form is submitted.
 *
 * Giving jsdom a real base URL fixes it — the same "/uploads/..." path
 * then resolves cleanly to `${SITE_URL}/uploads/...`.
 */
const purify = createDOMPurify(new JSDOM("", { url: SITE_URL }).window);

export function sanitizeHtml(dirty: string, config?: Config): string {
  return purify.sanitize(dirty, config) as string;
}
