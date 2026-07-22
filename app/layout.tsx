import type { Metadata } from "next";
import { Vazirmatn } from "next/font/google";
import Script from "next/script";

import { ThemeProvider } from "@/providers/ThemeProvider";
import { ToastProvider } from "@/providers/ToastProvider";
import { SITE_URL, SITE_NAME } from "@/lib/constants";
import { getSiteSettings } from "@/lib/site-settings";

import "./globals.css";

const vazirmatn = Vazirmatn({
  subsets: ["arabic", "latin"],
  variable: "--font-vazirmatn",
  display: "swap",
});

const DEFAULT_TITLE = "پیشتاک | جامعه مهندسان رباتیک، هوش مصنوعی و فناوری";
const DEFAULT_DESCRIPTION =
  "پیشتاک رویداد ماهانه رباتیک، هوش مصنوعی و مهندسی نرم‌افزار، برگزار شده توسط پژوهشکده رباتیک پیشنام.";

export async function generateMetadata(): Promise<Metadata> {
  const settings = await getSiteSettings();
  const title = settings.seoTitle || DEFAULT_TITLE;
  const description = settings.seoDescription || settings.description || DEFAULT_DESCRIPTION;
  const ogImages = settings.defaultOgImage ? [{ url: settings.defaultOgImage }] : undefined;

  return {
    metadataBase: new URL(SITE_URL),
    title: { default: title, template: `%s | ${SITE_NAME}` },
    description,
    alternates: { canonical: SITE_URL },
    openGraph: {
      type: "website",
      locale: "fa_IR",
      siteName: SITE_NAME,
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
    icons: settings.favicon ? { icon: settings.favicon } : undefined,
  };
}

export default async function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  const settings = await getSiteSettings();

  return (
    <html lang="fa" dir="rtl" suppressHydrationWarning>
      <body className={`${vazirmatn.variable} antialiased`}>
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
          <ToastProvider>{children}</ToastProvider>
        </ThemeProvider>

        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "Organization",
              name: SITE_NAME,
              url: SITE_URL,
              description: settings.description ?? DEFAULT_DESCRIPTION,
              sameAs: [settings.instagram, settings.telegram, settings.pishnamUrl].filter(Boolean),
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
