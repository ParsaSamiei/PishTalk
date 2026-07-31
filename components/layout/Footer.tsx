import { Globe, Mail, MapPin, Phone } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

import { Container } from "@/components/layout/Container";
import { Logo } from "@/components/shared/Logo";
import { SocialLinks } from "@/components/shared/SocialLinks";
import { CONTACT_PHONE } from "@/lib/constants";
import { getMainNavItems } from "@/lib/navigation";
import { getSiteSettings } from "@/lib/site-settings";
import { getLocaleContext } from "@/lib/i18n/server";
import { pick } from "@/lib/i18n/content";
import { SPONSORS } from "@/lib/sponsors";

interface FooterProps {
  readonly tagline?: string;
  readonly contactEmail?: string | null;
  readonly phone?: string | null;
  readonly phone2?: string | null;
  readonly address?: string | null;
  readonly instagram?: string | null;
  readonly telegram?: string | null;
  readonly pishnamUrl?: string | null;
}

/**
 * Footer per docs/03_Information_Architecture.md: About, Quick Links, Contact,
 * social links, Pishnam website, and copyright. Kept deliberately uncrowded.
 */
async function Footer({
  tagline,
  contactEmail,
  phone,
  phone2,
  address,
  instagram,
  telegram,
  pishnamUrl,
}: FooterProps) {
  const year = new Date().getFullYear();
  const [settings, { locale, dictionary: d }] = await Promise.all([
    getSiteSettings(),
    getLocaleContext(),
  ]);
  const navItems = getMainNavItems(d);
  const email = contactEmail ?? settings.contactEmail;
  const phoneNumber = phone ?? settings.phone ?? CONTACT_PHONE;
  const phoneNumber2 = phone2 ?? settings.phone2;
  // An address is prose, so it gets a translation; the caller's explicit prop
  // wins when provided.
  const streetAddress =
    address ?? pick(locale, settings.address, settings.addressEn);
  const instagramUrl = instagram ?? settings.instagram;
  const telegramUrl = telegram ?? settings.telegram;
  const pishnamWebsite =
    pishnamUrl ?? settings.pishnamUrl ?? "https://pishnam.com";
  // Prop wins, then the admin-set translation, then the dictionary default.
  const taglineText =
    tagline ?? pick(locale, settings.tagline, settings.taglineEn) ?? d.footer.tagline;
  const siteName = pick(locale, settings.siteName, settings.siteNameEn);
  const copyright =
    pick(locale, settings.copyright, settings.copyrightEn) ??
    `${siteName}. ${d.footer.rights}`;

  return (
    <footer className="border-t border-border bg-surface-secondary">
      <Container className="grid gap-8 py-10 sm:grid-cols-2 lg:grid-cols-4">
        <div className="flex flex-col gap-3 lg:col-span-2">
          <Logo />
          <p className="max-w-sm text-sm leading-relaxed text-text-secondary">
            {taglineText}
          </p>
          <SocialLinks instagram={instagramUrl} telegram={telegramUrl} />

          {SPONSORS.length > 0 ? (
            <div className="mt-1 flex flex-col gap-2">
              <h3 className="text-sm font-semibold text-text-primary">
                {d.footer.sponsors}
              </h3>

              <div className="flex flex-wrap items-center gap-x-8 gap-y-3">
                {SPONSORS.map((sponsor) => (
                  <a
                    key={sponsor.name}
                    href={sponsor.url}
                    target="_blank"
                    rel="noreferrer noopener"
                    aria-label={sponsor.name}
                    className="opacity-60  transition-all duration-150 hover:opacity-100 hover:grayscale-0"
                  >
                    <Image
                      src={sponsor.logo}
                      alt={sponsor.name}
                      width={200}
                      height={80}
                      className="h-20 w-auto object-contain"
                    />
                  </a>
                ))}
              </div>
            </div>
          ) : null}
        </div>

        <nav aria-label={d.footer.quickLinksLabel} className="flex flex-col gap-2">
          <h3 className="text-sm font-semibold text-text-primary">
            {d.footer.quickLinks}
          </h3>

          <ul className="flex flex-col gap-1.5">
            {navItems.slice(0, 6).map((item) => (
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

        <div className="flex flex-col gap-2">
          <h3 className="text-sm font-semibold text-text-primary">
            {d.footer.contactUs}
          </h3>

          <ul className="flex flex-col gap-2 text-sm text-text-secondary">
            {email ? (
              <li>
                <a
                  href={`mailto:${email}`}
                  className="group flex items-center gap-3 transition-colors hover:text-text-primary"
                >
                  <span className="flex size-7 shrink-0 items-center justify-center rounded-full border border-border transition-colors duration-150 group-hover:border-accent group-hover:text-accent-hover">
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
                  <span className="flex size-7 shrink-0 items-center justify-center rounded-full border border-border transition-colors duration-150 group-hover:border-accent group-hover:text-accent-hover">
                    <Phone className="size-3.5" aria-hidden="true" />
                  </span>
                  <span dir="ltr">{phoneNumber}</span>
                </a>
              </li>
            ) : null}

            {phoneNumber2 ? (
              <li>
                <a
                  href={`tel:${phoneNumber2}`}
                  className="group flex items-center gap-3 transition-colors hover:text-text-primary"
                >
                  <span className="flex size-7 shrink-0 items-center justify-center rounded-full border border-border transition-colors duration-150 group-hover:border-accent group-hover:text-accent-hover">
                    <Phone className="size-3.5" aria-hidden="true" />
                  </span>
                  <span dir="ltr">{phoneNumber2}</span>
                </a>
              </li>
            ) : null}

            {streetAddress ? (
              <li className="flex items-center gap-3">
                <span className="flex size-7 shrink-0 items-center justify-center rounded-full border border-border">
                  <MapPin
                    className="size-3.5 text-text-secondary"
                    aria-hidden="true"
                  />
                </span>
                <span>{streetAddress}</span>
              </li>
            ) : null}

            <li>
              <a
                href={pishnamWebsite}
                target="_blank"
                rel="noreferrer noopener"
                className="group flex items-center gap-3 transition-colors hover:text-text-primary"
              >
                <span className="flex size-7 shrink-0 items-center justify-center rounded-full border border-border transition-colors duration-150 group-hover:border-accent group-hover:text-accent-hover">
                  <Globe className="size-3.5" aria-hidden="true" />
                </span>
                {d.footer.pishnamSite}
              </a>
            </li>
          </ul>

          {settings.googleMapsEmbed ? (
            <div
              className="max-h-32 overflow-hidden rounded-card border border-border [&_iframe]:h-full [&_iframe]:w-full"
              style={{ aspectRatio: "16 / 9" }}
              dangerouslySetInnerHTML={{
                __html: settings.googleMapsEmbed,
              }}
            />
          ) : null}
        </div>
      </Container>

      <div className="border-t border-border">
        <Container className="py-4 text-center text-sm text-text-secondary">
          © {year} {copyright}
        </Container>
      </div>
    </footer>
  );
}

export { Footer };
