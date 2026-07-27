export const SITE_URL =
  process.env.NEXT_PUBLIC_SITE_URL ?? "https://pishtalk.ir";

export const SITE_NAME = "پیشتاک";

export const PISHNAM_URL = "https://pishnam.com";

/**
 * Fallback contact phone number shown in the footer's "ارتباط با ما" section
 * as a tel: link. Used only when no phone is set in the admin Site Settings
 * (SiteSettings.phone) — the admin-panel value always takes priority.
 * Fill in below, e.g. "+98 21 1234 5678".
 */
export const CONTACT_PHONE: string | null = "+98 912 88 99 113";
