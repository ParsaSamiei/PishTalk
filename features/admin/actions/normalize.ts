/**
 * Form inputs arrive as strings, so an untouched optional field is `""`
 * rather than absent. Persisting that would put empty strings in columns
 * whose meaning is "not translated yet" — `NULL` says that properly, and
 * keeps `COALESCE`-style queries and DB-level checks honest.
 *
 * `pick()` treats blank and null alike when rendering, so this is about
 * storing clean data rather than about display.
 */
export function blankToNull<T extends Record<string, unknown>>(
  values: T,
  keys: readonly (keyof T)[],
): T {
  const result = { ...values };
  for (const key of keys) {
    const value = result[key];
    if (typeof value === "string" && value.trim() === "") {
      result[key] = null as T[keyof T];
    }
  }
  return result;
}
