import { prisma } from "@/lib/prisma";

export interface SiteSettingsData {
  siteName: string;
  tagline: string;
  description: string | null;
  logo: string | null;
  favicon: string | null;
  heroTitle: string | null;
  heroSubtitle: string | null;
  contactEmail: string | null;
  phone: string | null;
  address: string | null;
  instagram: string | null;
  telegram: string | null;
  pishnamUrl: string | null;
  googleMapsEmbed: string | null;
  seoTitle: string | null;
  seoDescription: string | null;
  defaultOgImage: string | null;
  googleAnalyticsId: string | null;
  maintenanceMode: boolean;
}

const FALLBACK_SETTINGS: SiteSettingsData = {
  siteName: "پیشتاک",
  tagline: "جامعه مهندسان رباتیک، هوش مصنوعی و فناوری",
  description:
    "پیشتاک رویداد ماهانه رباتیک، هوش مصنوعی و مهندسی نرم‌افزار است که توسط پژوهشکده رباتیک پیشنام برگزار می‌شود.",
  logo: null,
  favicon: null,
  heroTitle: null,
  heroSubtitle: null,
  contactEmail: null,
  phone: null,
  address: null,
  instagram: null,
  telegram: null,
  pishnamUrl: "https://pishnam.org",
  googleMapsEmbed: null,
  seoTitle: null,
  seoDescription: null,
  defaultOgImage: null,
  googleAnalyticsId: null,
  maintenanceMode: false,
};

/**
 * Reads the singleton site settings row.
 *
 * Falls back to sane defaults when the database has not been provisioned
 * yet (e.g. during initial setup, or if a query fails), so the marketing
 * pages never crash while the admin has not filled in settings.
 */
export async function getSiteSettings(): Promise<SiteSettingsData> {
  try {
    const settings = await prisma.siteSettings.findFirst();
    if (!settings) return FALLBACK_SETTINGS;

    return {
      siteName: settings.siteName,
      tagline: settings.tagline,
      description: settings.description,
      logo: settings.logo,
      favicon: settings.favicon,
      heroTitle: settings.heroTitle,
      heroSubtitle: settings.heroSubtitle,
      contactEmail: settings.contactEmail,
      phone: settings.phone,
      address: settings.address,
      instagram: settings.instagram,
      telegram: settings.telegram,
      pishnamUrl: settings.pishnamUrl,
      googleMapsEmbed: settings.googleMapsEmbed,
      seoTitle: settings.seoTitle,
      seoDescription: settings.seoDescription,
      defaultOgImage: settings.defaultOgImage,
      googleAnalyticsId: settings.googleAnalyticsId,
      maintenanceMode: settings.maintenanceMode,
    };
  } catch {
    return FALLBACK_SETTINGS;
  }
}
