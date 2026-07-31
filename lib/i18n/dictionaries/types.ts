import type { fa } from "./fa";

/**
 * Recursively widens the `as const` literal types from `fa.ts` to `string`,
 * so `en.ts` can hold different values while keeping exactly the same keys.
 */
type Widen<T> = T extends string
  ? string
  : { [K in keyof T]: Widen<T[K]> };

/** The shape every dictionary must satisfy. Derived from the Persian one. */
export type Dictionary = Widen<typeof fa>;
