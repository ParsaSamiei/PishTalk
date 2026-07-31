import type { Metadata } from "next";

import { NotFoundContent } from "@/components/shared/NotFoundContent";
import { getDictionary } from "@/lib/i18n/server";

export async function generateMetadata(): Promise<Metadata> {
  const d = await getDictionary();

  return {
    title: d.notFound.metaTitle,
    description: d.notFound.metaDescription,
    robots: { index: false, follow: true },
  };
}

/**
 * Renders when notFound() is called from a page inside the (marketing)
 * group (e.g. an unknown blog/event/gallery slug). Already wrapped by
 * MarketingLayout's Navbar/Footer, so only the content itself is needed
 * here — see NotFoundContent for the shared visual.
 */
export default function NotFound() {
  return <NotFoundContent />;
}
