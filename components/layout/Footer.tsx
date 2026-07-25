import { Globe, Mail, Phone } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

import { Container } from "@/components/layout/Container";
import { Logo } from "@/components/shared/Logo";
import { SocialLinks } from "@/components/shared/SocialLinks";
import { CONTACT_PHONE } from "@/lib/constants";
import { MAIN_NAV_ITEMS } from "@/lib/navigation";
import { getSiteSettings } from "@/lib/site-settings";
import { SPONSORS } from "@/lib/sponsors";

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
  const phoneNumber = phone ?? settings.phone ?? CONTACT_PHONE;
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

          {SPONSORS.length > 0 ? (
            <div className="mt-2 flex flex-col gap-3">
              <h3 className="text-sm font-semibold text-text-primary">
                حامیان و اسپانسرها
              </h3>

              <div className="flex flex-wrap items-center gap-x-8 gap-y-4">
                {SPONSORS.map((sponsor) => (
                  <a
                    key={sponsor.name}
                    href={sponsor.url}
                    target="_blank"
                    rel="noreferrer noopener"
                    aria-label={sponsor.name}
                    className="opacity-70 grayscale transition-all duration-150 hover:opacity-100 hover:grayscale-0"
                  >
                    <Image
                      src={sponsor.logo}
                      alt={sponsor.name}
                      width={200}
                      height={80}
                      className="h-14 w-auto object-contain"
                    />
                  </a>
                ))}
              </div>
            </div>
          ) : null}
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

          <ul className="flex flex-col gap-3 text-sm text-text-secondary">
            {email ? (
              <li>
                <a
                  href={`mailto:${email}`}
                  className="group flex items-center gap-3 transition-colors hover:text-text-primary"
                >
                  <span className="flex size-8 shrink-0 items-center justify-center rounded-full border border-border transition-colors duration-150 group-hover:border-accent group-hover:text-accent-hover">
                    <Mail className="size-3.5" aria-hidden="true" />
                  </span>
                  {email}
                </a>
              </li>
            ) : null}

            {phoneNumber ? (
              <li>
                <a
                  href={`tel:${phoneNumber}`}
                  className="group flex items-center gap-3 transition-colors hover:text-text-primary"
                >
                  <span className="flex size-8 shrink-0 items-center justify-center rounded-full border border-border transition-colors duration-150 group-hover:border-accent group-hover:text-accent-hover">
                    <Phone className="size-3.5" aria-hidden="true" />
                  </span>
                  <span dir="ltr">{phoneNumber}</span>
                </a>
              </li>
            ) : null}

            <li>
              <a
                href={pishnamWebsite}
                target="_blank"
                rel="noreferrer noopener"
                className="group flex items-center gap-3 transition-colors hover:text-text-primary"
              >
                <span className="flex size-8 shrink-0 items-center justify-center rounded-full border border-border transition-colors duration-150 group-hover:border-accent group-hover:text-accent-hover">
                  <Globe className="size-3.5" aria-hidden="true" />
                </span>
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
