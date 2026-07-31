import { prisma } from "@/lib/prisma";
import { SiteSettingsForm } from "@/features/admin/components/SiteSettingsForm";

export default async function AdminSettingsPage() {
  const settings = await prisma.siteSettings.findFirst();

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="text-2xl font-bold text-text-primary">تنظیمات سایت</h1>
        <p className="text-text-secondary">
          اطلاعاتی که در سراسر سایت نمایش داده می‌شود
        </p>
      </div>
      <SiteSettingsForm
        defaultValues={{
          siteName: settings?.siteName ?? "پیشتاک",
          tagline: settings?.tagline ?? "جامعه مهندسان رباتیک",
          description: settings?.description ?? "",
          logo: settings?.logo ?? "",
          favicon: settings?.favicon ?? "",
          heroTitle: settings?.heroTitle ?? "",
          heroSubtitle: settings?.heroSubtitle ?? "",
          contactEmail: settings?.contactEmail ?? "",
          phone: settings?.phone ?? "",
          phone2: settings?.phone2 ?? "",
          address: settings?.address ?? "",
          instagram: settings?.instagram ?? "",
          telegram: settings?.telegram ?? "",
          pishnamUrl: settings?.pishnamUrl ?? "",
          googleMapsEmbed: settings?.googleMapsEmbed ?? "",
          seoTitle: settings?.seoTitle ?? "",
          seoDescription: settings?.seoDescription ?? "",
          defaultOgImage: settings?.defaultOgImage ?? "",
          googleAnalyticsId: settings?.googleAnalyticsId ?? "",
          maintenanceMode: settings?.maintenanceMode ?? false,
          siteNameEn: settings?.siteNameEn ?? "",
          taglineEn: settings?.taglineEn ?? "",
          descriptionEn: settings?.descriptionEn ?? "",
          heroTitleEn: settings?.heroTitleEn ?? "",
          heroSubtitleEn: settings?.heroSubtitleEn ?? "",
          addressEn: settings?.addressEn ?? "",
          copyrightEn: settings?.copyrightEn ?? "",
          seoTitleEn: settings?.seoTitleEn ?? "",
          seoDescriptionEn: settings?.seoDescriptionEn ?? "",
        }}
      />
    </div>
  );
}
