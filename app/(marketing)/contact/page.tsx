import type { Metadata } from "next";
import { Mail, MapPin, Phone } from "lucide-react";

import { Container } from "@/components/layout/Container";
import { Section } from "@/components/layout/Section";
import { SocialLinks } from "@/components/shared/SocialLinks";
import { ContactForm } from "@/features/contact/components/ContactForm";
import { CONTACT_PHONE } from "@/lib/constants";
import { getSiteSettings } from "@/lib/site-settings";

export const metadata: Metadata = {
  title: "تماس با ما",
  description:
    "برای همکاری، سخنرانی یا هر سوال دیگری با تیم پیشتاک در ارتباط باشید.",
};

export default async function ContactPage() {
  const settings = await getSiteSettings();
  const phoneNumber = settings.phone ?? CONTACT_PHONE;

  return (
    <Section className="pt-12" circuit>
      <Container className="grid gap-12 lg:grid-cols-2">
        <div className="flex flex-col gap-6">
          <div className="flex flex-col gap-3">
            <h1 className="text-3xl font-bold text-text-primary sm:text-4xl">
              تماس با ما
            </h1>
            <p className="text-lg text-text-secondary">
              برای همکاری، سخنرانی یا هر سوال دیگری، پیام بگذارید.
            </p>
          </div>
          <ul className="flex flex-col gap-4 text-text-secondary">
            {settings.contactEmail ? (
              <li>
                <a
                  href={`mailto:${settings.contactEmail}`}
                  className="group flex items-center gap-3 transition-colors hover:text-text-primary"
                >
                  <span className="flex size-10 shrink-0 items-center justify-center rounded-full border border-border transition-colors duration-150 group-hover:border-accent group-hover:text-accent-hover">
                    <Mail className="size-4" aria-hidden="true" />
                  </span>
                  {settings.contactEmail}
                </a>
              </li>
            ) : null}
            {phoneNumber ? (
              <li>
                <a
                  href={`tel:${phoneNumber}`}
                  className="group flex items-center gap-3 transition-colors hover:text-text-primary"
                >
                  <span className="flex size-10 shrink-0 items-center justify-center rounded-full border border-border transition-colors duration-150 group-hover:border-accent group-hover:text-accent-hover">
                    <Phone className="size-4" aria-hidden="true" />
                  </span>
                  <span dir="ltr">{phoneNumber}</span>
                </a>
              </li>
            ) : null}
            {settings.phone2 ? (
              <li>
                <a
                  href={`tel:${settings.phone2}`}
                  className="group flex items-center gap-3 transition-colors hover:text-text-primary"
                >
                  <span className="flex size-10 shrink-0 items-center justify-center rounded-full border border-border transition-colors duration-150 group-hover:border-accent group-hover:text-accent-hover">
                    <Phone className="size-4" aria-hidden="true" />
                  </span>
                  <span dir="ltr">{settings.phone2}</span>
                </a>
              </li>
            ) : null}
            {settings.address ? (
              <li className="flex items-center gap-3">
                <span className="flex size-10 shrink-0 items-center justify-center rounded-full border border-border">
                  <MapPin
                    className="size-4 text-text-secondary"
                    aria-hidden="true"
                  />
                </span>
                <span>{settings.address}</span>
              </li>
            ) : null}
          </ul>
          <SocialLinks
            instagram={settings.instagram}
            telegram={settings.telegram}
          />

          {settings.googleMapsEmbed ? (
            <div
              className="overflow-hidden rounded-card border border-border [&_iframe]:h-full [&_iframe]:w-full"
              style={{ aspectRatio: "16 / 9" }}
              dangerouslySetInnerHTML={{ __html: settings.googleMapsEmbed }}
            />
          ) : null}
        </div>

        <ContactForm />
      </Container>
    </Section>
  );
}
