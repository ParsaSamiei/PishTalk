import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { MaintenanceScreen } from "@/components/shared/MaintenanceScreen";
import { getSiteSettings } from "@/lib/site-settings";
import { getLocale } from "@/lib/i18n/server";
import { pick } from "@/lib/i18n/content";

export default async function MarketingLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  const [settings, locale] = await Promise.all([
    getSiteSettings(),
    getLocale(),
  ]);

  if (settings.maintenanceMode) {
    return (
      <MaintenanceScreen
        siteName={pick(locale, settings.siteName, settings.siteNameEn)}
      />
    );
  }

  return (
    <div className="flex min-h-screen flex-col">
      <Navbar />
      <main className="flex-1">{children}</main>
      {/* Footer reads site settings itself and localizes them via pick(), so
          passing the raw Persian values here would override that and pin the
          footer to Persian for English visitors. */}
      <Footer />
    </div>
  );
}
