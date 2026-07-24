export interface NavItem {
  readonly label: string;
  readonly href: string;
}

/**
 * Single source of truth for the primary navigation, per
 * docs/03_Information_Architecture.md.
 */
export const MAIN_NAV_ITEMS: readonly NavItem[] = [
  { label: "خانه", href: "/" },
  { label: "رویدادها", href: "/events" },
  { label: "وبلاگ", href: "/blog" },
  { label: "منابع", href: "/resources" },
  { label: "گالری", href: "/gallery" },
  { label: "قوانین", href: "/rules" },
  { label: "سوالات متداول", href: "/faq" },
  { label: "درباره ما", href: "/about" },
  { label: "تماس با ما", href: "/contact" },
];
