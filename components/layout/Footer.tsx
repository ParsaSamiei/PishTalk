import Link from "next/link";

import { Container } from "@/components/layout/Container";
import { Logo } from "@/components/shared/Logo";
import { SocialLinks } from "@/components/shared/SocialLinks";
import { MAIN_NAV_ITEMS } from "@/lib/navigation";
import { getSiteSettings } from "@/lib/site-settings";

interface FooterProps {
  readonly tagline?: string;
  readonly contactEmail?: string | null;
  readonly phone?: string | null;
  readonly instagram?: string | null;
  readonly telegram?: string | null;
  readonly pishnamUrl?: string | null;
}

/**
 * Footer per docs/03_Information_Architecture.md: About, Quick Links, Contact,
 * social links, Pishnam website, and copyright. Kept deliberately uncrowded.
 */
async function Footer({
  tagline = "جامعه مهندسان رباتیک، هوش مصنوعی و فناوری",
  contactEmail,
  phone,
  instagram,
  telegram,
  pishnamUrl = "https://pishnam.org",
}: FooterProps) {
  const year = new Date().getFullYear();
  const settings = await getSiteSettings();
  const email = contactEmail ?? settings.contactEmail;
  const phoneNumber = phone ?? settings.phone;
  const instagramUrl = instagram ?? settings.instagram;
  const telegramUrl = telegram ?? settings.telegram;
  const pishnamWebsite =
    pishnamUrl ?? settings.pishnamUrl ?? "https://pishnam.com";

  return (
    <footer className="border-t border-border bg-surface-secondary">
      <Container className="grid gap-10 py-16 sm:grid-cols-2 lg:grid-cols-4">
        <div className="flex flex-col gap-4 lg:col-span-2">
          <Logo />
          <p className="max-w-sm text-sm leading-relaxed text-text-secondary">
            {tagline}
          </p>
          <SocialLinks instagram={instagramUrl} telegram={telegramUrl} />
        </div>

        <nav aria-label="لینک‌های سریع" className="flex flex-col gap-3">
          <h3 className="text-sm font-semibold text-text-primary">
            لینک‌های سریع
          </h3>

          <ul className="flex flex-col gap-2">
            {MAIN_NAV_ITEMS.slice(0, 6).map((item) => (
              <li key={item.href}>
                <Link
                  href={item.href}
                  className="text-sm text-text-secondary transition-colors hover:text-text-primary"
                >
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        <div className="flex flex-col gap-3">
          <h3 className="text-sm font-semibold text-text-primary">
            ارتباط با ما
          </h3>

          <ul className="flex flex-col gap-2 text-sm text-text-secondary">
            {email ? (
              <li>
                <a href={`mailto:${email}`} className="hover:text-text-primary">
                  {email}
                </a>
              </li>
            ) : null}

            {phoneNumber ? (
              <li>
                <a
                  href={`tel:${phoneNumber}`}
                  className="hover:text-text-primary"
                  dir="ltr"
                >
                  {phoneNumber}
                </a>
              </li>
            ) : null}

            <li>
              <a
                href={pishnamWebsite}
                target="_blank"
                rel="noreferrer noopener"
                className="hover:text-text-primary"
              >
                وب‌سایت پیشنام
              </a>
            </li>
          </ul>

          {settings.googleMapsEmbed ? (
            <div
              className="overflow-hidden rounded-card border border-border [&_iframe]:h-full [&_iframe]:w-full"
              style={{ aspectRatio: "16 / 9" }}
              dangerouslySetInnerHTML={{
                __html: settings.googleMapsEmbed,
              }}
            />
          ) : null}
        </div>
      </Container>

      <div className="border-t border-border">
        <Container className="py-6 text-center text-sm text-text-secondary">
          © {year} پیشتاک. تمامی حقوق محفوظ است.
        </Container>
      </div>
    </footer>
  );
}

export { Footer };
