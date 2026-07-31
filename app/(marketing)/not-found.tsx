import type { Metadata } from "next";

import { NotFoundContent } from "@/components/shared/NotFoundContent";

export const metadata: Metadata = {
  title: "صفحه پیدا نشد",
  description:
    "این صفحه پیدا نشد. ممکن است لینک اشتباه باشد یا صفحه جابه‌جا شده باشد.",
  robots: { index: false, follow: true },
};

/**
 * Renders when notFound() is called from a page inside the (marketing)
 * group (e.g. an unknown blog/event/gallery slug). Already wrapped by
 * MarketingLayout's Navbar/Footer, so only the content itself is needed
 * here — see NotFoundContent for the shared visual.
 */
export default function NotFound() {
  return <NotFoundContent />;
}
