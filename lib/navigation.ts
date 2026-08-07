import type { Dictionary } from "@/lib/i18n/dictionaries";

export interface NavItem {
  readonly label: string;
  readonly href: string;
}

/**
 * Single source of truth for the primary navigation, per
 * docs/03_Information_Architecture.md.
 *
 * Labels come from the active dictionary rather than being hardcoded, so the
 * order and hrefs stay defined in one place while the wording follows the
 * visitor's locale.
 */
export function getMainNavItems(d: Dictionary): readonly NavItem[] {
  return [
    { label: d.nav.home, href: "/" },
    { label: d.nav.events, href: "/events" },
    { label: d.nav.blog, href: "/blog" },
    { label: d.nav.resources, href: "/resources" },
    { label: d.nav.gallery, href: "/gallery" },
    { label: d.nav.rules, href: "/rules" },
    { label: d.nav.support, href: "/support" },
    { label: d.nav.faq, href: "/faq" },
    { label: d.nav.about, href: "/about" },
    { label: d.nav.contact, href: "/contact" },
  ];
}
