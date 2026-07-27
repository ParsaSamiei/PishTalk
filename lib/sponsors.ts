export interface Sponsor {
  readonly name: string;
  /** Path under /public/sponsors, e.g. "/sponsors/example.svg". */
  readonly logo: string;
  readonly url: string;
}

/**
 * Sponsors & supporters shown as logos in the footer, each linking out to
 * the sponsor's website. Single source of truth, same pattern as
 * MAIN_NAV_ITEMS in lib/navigation.ts.
 *
 * To add a sponsor:
 * 1. Drop their logo file into /public/sponsors (svg or png, transparent
 *    background preferred).
 * 2. Add an entry below pointing at it.
 */
export const SPONSORS: readonly Sponsor[] = [
  {
    name: "Pishnam",
    logo: "/sponsors/Pishnam.png",
    url: "https://pishnam.com",
  },
];
