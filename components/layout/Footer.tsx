import { Globe, Mail, Phone } from "lucide-react";
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
import { getSponsors } from "@/lib/support";
// Single source of truth for the app version shown in the footer — bump it
// in package.json and it flows through automatically, no separate constant
// to forget to update. Import the whole module (not a named `version`
// export) since Next/webpack only allows the default export from JSON.
import packageJson from "@/package.json";

interface FooterProps {
  readonly tagline?: string;
  readonly contactEmail?: string | null;
  readonly phone?: string | null;
  readonly phone2?: string | null;
  // readonly address?: string | null;
  readonly instagram?: string | null;
  readonly telegram?: string | null;
  // readonly pishnamUrl?: string | null;
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
  // address,
  instagram,
  telegram,
  // pishnamUrl,
}: FooterProps) {
  const year = new Date().getFullYear();
  const [settings, { locale, dictionary: d }, sponsors] = await Promise.all([
    getSiteSettings(),
    getLocaleContext(),
    // Same Sponsor model / admin/sponsors screen that backs the /support
    // page, so a supporter added there shows up here automatically.
    getSponsors(),
  ]);
  const navItems = getMainNavItems(d);
  const email = contactEmail ?? settings.contactEmail;
  const phoneNumber = phone ?? settings.phone ?? CONTACT_PHONE;
  const phoneNumber2 = phone2 ?? settings.phone2;
  // An address is prose, so it gets a translation; the caller's explicit prop
  // wins when provided.
  // const streetAddress =
  //   address ?? pick(locale, settings.address, settings.addressEn);
  const instagramUrl = instagram ?? settings.instagram;
  const telegramUrl = telegram ?? settings.telegram;
  // const pishnamWebsite =
  //   pishnamUrl ?? settings.pishnamUrl ?? "https://pishnam.com";
  // Prop wins, then the admin-set translation, then the dictionary default.
  const taglineText =
    tagline ??
    pick(locale, settings.tagline, settings.taglineEn) ??
    d.footer.tagline;
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
        </div>

        <nav
          aria-label={d.footer.quickLinksLabel}
          className="flex flex-col gap-2"
        >
          <h3 className="text-sm font-semibold text-text-primary">
            {d.footer.quickLinks}
          </h3>

          <ul className="grid grid-flow-col grid-rows-3 gap-x-6 gap-y-1.5">
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
            {/* Not part of getMainNavItems: the header nav is already full,
                so this stays footer-only rather than crowding the navbar. */}
            {/* <li>
              <Link
                href="/my-registrations"
                className="text-sm text-text-secondary transition-colors hover:text-text-primary"
              >
                {d.registration.viewMyRegistrations}
              </Link>
            </li> */}
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

            {/* {streetAddress ? (
              <li className="flex items-center gap-3">
                <span className="flex size-7 shrink-0 items-center justify-center rounded-full border border-border">
                  <MapPin
                    className="size-3.5 text-text-secondary"
                    aria-hidden="true"
                  />
                </span>
                <span>{streetAddress}</span>
              </li>
            ) : null} */}

            {/* <li>
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
            </li> */}
          </ul>

          {/* {settings.googleMapsEmbed ? (
            <div
              className="max-h-32 overflow-hidden rounded-card border border-border [&_iframe]:h-full [&_iframe]:w-full"
              style={{ aspectRatio: "16 / 9" }}
              dangerouslySetInnerHTML={{
                __html: settings.googleMapsEmbed,
              }}
            />
          ) : null} */}
        </div>
      </Container>

      {sponsors.length > 0 ? (
        <div className="border-t border-border">
          <Container className="flex flex-col items-center gap-3 py-6">
            <h3 className="text-sm font-semibold text-text-primary">
              {d.footer.sponsors}
            </h3>

            {/* justify-center means a single sponsor sits dead-center
            instead of hugging the start edge, and a full row stays
            centered as a group rather than spreading edge to edge. */}
            <div className="flex flex-wrap items-center justify-center gap-x-8 gap-y-3">
              {sponsors.map((sponsor) =>
                sponsor.logo ? (
                  <a
                    key={sponsor.id}
                    href={sponsor.url ?? undefined}
                    target={sponsor.url ? "_blank" : undefined}
                    rel={sponsor.url ? "noreferrer noopener" : undefined}
                    aria-label={sponsor.name}
                    className="opacity-60 transition-all duration-150 hover:opacity-100 hover:grayscale-0"
                  >
                    <Image
                      src={sponsor.logo}
                      alt={sponsor.name}
                      width={200}
                      height={80}
                      className="h-18 w-auto object-contain"
                    />
                  </a>
                ) : (
                  // A supporter can be listed by name alone (no logo
                  // uploaded in the admin panel), so fall back to text.
                  <a
                    key={sponsor.id}
                    href={sponsor.url ?? undefined}
                    target={sponsor.url ? "_blank" : undefined}
                    rel={sponsor.url ? "noreferrer noopener" : undefined}
                    className="text-sm font-medium text-text-secondary opacity-60 transition-all duration-150 hover:text-text-primary hover:opacity-100"
                  >
                    {sponsor.name}
                  </a>
                ),
              )}
            </div>
          </Container>
        </div>
      ) : null}

      <div className="border-t border-border">
        <Container className="flex flex-col items-center justify-center gap-2 py-4 text-center text-sm text-text-secondary sm:flex-row sm:gap-3">
          <span>
            © {year} {copyright}
          </span>

          {/* Version stays LTR and monospaced regardless of locale, same
              treatment as phone numbers above — it's a build identifier,
              not prose, so it shouldn't be affected by the RTL context. */}
          <span
            dir="ltr"
            className="inline-flex items-center gap-1 rounded-full border border-border px-2 py-0.5 font-mono text-xs text-text-secondary/70"
            title={`${d.footer.version} ${packageJson.version}`}
          >
            v{packageJson.version}
          </span>
        </Container>
      </div>
    </footer>
  );
}

export { Footer };
