import type { Metadata } from "next";
import { Vazirmatn } from "next/font/google";
import Script from "next/script";

import { ThemeProvider } from "@/providers/ThemeProvider";
import { ToastProvider } from "@/providers/ToastProvider";
import { SITE_URL } from "@/lib/constants";
import { getSiteSettings } from "@/lib/site-settings";
import { getLocaleContext } from "@/lib/i18n/server";
import { LocaleProvider } from "@/lib/i18n/client";
import { LOCALE_OG } from "@/lib/i18n/config";
import { pick } from "@/lib/i18n/content";
import CustomCursor from "@/components/ui/CustomCursor";

import "./globals.css";

const vazirmatn = Vazirmatn({
  subsets: ["arabic", "latin"],
  variable: "--font-vazirmatn",
  display: "swap",
});

const DEFAULT_TITLE = "پیشتاک | جامعه مهندسان رباتیک";
const DEFAULT_DESCRIPTION =
  "پیشتاک رویداد ماهانه رباتیک، هوش مصنوعی و مهندسی نرم‌افزار، برگزار شده توسط باشگاه رباتیک پیشنام.";

const DEFAULT_TITLE_EN = "Pishtalk | A community of robotics engineers";
const DEFAULT_DESCRIPTION_EN =
  "Pishtalk is a monthly event on robotics, AI and software engineering, hosted by the Pishnam Robotics Club.";

export async function generateMetadata(): Promise<Metadata> {
  const [settings, { locale }] = await Promise.all([
    getSiteSettings(),
    getLocaleContext(),
  ]);

  const isEnglish = locale === "en";
  const fallbackTitle = isEnglish ? DEFAULT_TITLE_EN : DEFAULT_TITLE;
  const fallbackDescription = isEnglish
    ? DEFAULT_DESCRIPTION_EN
    : DEFAULT_DESCRIPTION;

  const siteName = pick(locale, settings.siteName, settings.siteNameEn);
  const title =
    pick(locale, settings.seoTitle, settings.seoTitleEn) || fallbackTitle;
  const description =
    pick(locale, settings.seoDescription, settings.seoDescriptionEn) ||
    pick(locale, settings.description, settings.descriptionEn) ||
    fallbackDescription;

  const ogImages = settings.defaultOgImage
    ? [{ url: settings.defaultOgImage }]
    : undefined;

  return {
    metadataBase: new URL(SITE_URL),
    title: { default: title, template: `%s | ${siteName}` },
    description,
    alternates: { canonical: SITE_URL },
    openGraph: {
      type: "website",
      locale: LOCALE_OG[locale],
      siteName,
      title,
      description,
      images: ogImages,
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: ogImages,
    },
    icons: {
      icon: settings.favicon || "/favicon.ico",
      apple: "/apple-icon.png",
    },
  };
}

export default async function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  const [settings, { locale, lang, dir }] = await Promise.all([
    getSiteSettings(),
    getLocaleContext(),
  ]);

  return (
    <html lang={lang} dir={dir} suppressHydrationWarning>
      <body className={`${vazirmatn.variable} antialiased`}>
        <CustomCursor />
        <LocaleProvider locale={locale}>
          <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
            <ToastProvider>{children}</ToastProvider>
          </ThemeProvider>
        </LocaleProvider>

        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "Organization",
              name: pick(locale, settings.siteName, settings.siteNameEn),
              url: SITE_URL,
              description:
                pick(locale, settings.description, settings.descriptionEn) ??
                (locale === "en" ? DEFAULT_DESCRIPTION_EN : DEFAULT_DESCRIPTION),
              sameAs: [
                settings.instagram,
                settings.telegram,
                settings.pishnamUrl,
              ].filter(Boolean),
            }),
          }}
        />

        {settings.googleAnalyticsId ? (
          <>
            <Script
              src={`https://www.googletagmanager.com/gtag/js?id=${settings.googleAnalyticsId}`}
              strategy="afterInteractive"
            />
            <Script id="google-analytics" strategy="afterInteractive">
              {`
                window.dataLayer = window.dataLayer || [];
                function gtag(){dataLayer.push(arguments);}
                gtag('js', new Date());
                gtag('config', '${settings.googleAnalyticsId}');
              `}
            </Script>
          </>
        ) : null}
      </body>
    </html>
  );
}
