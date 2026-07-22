import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { MaintenanceScreen } from "@/components/shared/MaintenanceScreen";
import { getSiteSettings } from "@/lib/site-settings";

export default async function MarketingLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  const settings = await getSiteSettings();

  if (settings.maintenanceMode) {
    return <MaintenanceScreen siteName={settings.siteName} />;
  }

  return (
    <div className="flex min-h-screen flex-col">
      <Navbar />
      <main className="flex-1">{children}</main>
      <Footer
        tagline={settings.tagline}
        contactEmail={settings.contactEmail}
        phone={settings.phone}
        instagram={settings.instagram}
        telegram={settings.telegram}
        pishnamUrl={settings.pishnamUrl}
      />
    </div>
  );
}
