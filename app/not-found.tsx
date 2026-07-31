import type { Metadata } from "next";

import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
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
 * Root 404 boundary — this is the file Next.js actually renders for a URL
 * that doesn't match any route in the app at all (a typo'd path, a dead
 * external link, etc). Those requests never reach
 * app/(marketing)/layout.tsx, so this page brings its own Navbar/Footer
 * (same as MarketingLayout does) rather than falling back to Next's bare
 * default 404. app/(marketing)/not-found.tsx handles the other case — an
 * in-app notFound() call for a page that IS inside the marketing group
 * (e.g. an unknown blog slug) — and is already wrapped by that layout.
 *
 * Per docs/03_Information_Architecture.md ("/404: Custom 404") and
 * docs/08_SEO.md ("Helpful Navigation", "Return Home"); see
 * NotFoundContent for the shared visual.
 */
export default async function NotFound() {
  return (
    <div className="flex min-h-screen flex-col">
      <Navbar />
      <main className="flex-1">
        <NotFoundContent />
      </main>
      {/* Footer reads site settings itself and localizes them, so passing the
          raw Persian columns here would pin it to Persian. */}
      <Footer />
    </div>
  );
}
