import type { Metadata } from "next";
import { Mail, MapPin, Phone } from "lucide-react";

import { Container } from "@/components/layout/Container";
import { Section } from "@/components/layout/Section";
import { SocialLinks } from "@/components/shared/SocialLinks";
import { ContactForm } from "@/features/contact/components/ContactForm";
import { getSiteSettings } from "@/lib/site-settings";

export const metadata: Metadata = {
  title: "تماس با ما",
  description: "برای همکاری، سخنرانی یا هر سوال دیگری با تیم پیشتاک در ارتباط باشید.",
};

export default async function ContactPage() {
  const settings = await getSiteSettings();

  return (
    <Section className="pt-12">
      <Container className="grid gap-12 lg:grid-cols-2">
        <div className="flex flex-col gap-6">
          <div className="flex flex-col gap-3">
            <h1 className="text-3xl font-bold text-text-primary sm:text-4xl">تماس با ما</h1>
            <p className="text-lg text-text-secondary">
              برای همکاری، سخنرانی یا هر سوال دیگری، پیام بگذارید.
            </p>
          </div>
          <ul className="flex flex-col gap-4 text-text-secondary">
            {settings.contactEmail ? (
              <li className="flex items-center gap-3">
                <Mail className="size-5 text-accent-hover" aria-hidden="true" />
                <a href={`mailto:${settings.contactEmail}`} className="hover:text-text-primary">
                  {settings.contactEmail}
                </a>
              </li>
            ) : null}
            {settings.phone ? (
              <li className="flex items-center gap-3">
                <Phone className="size-5 text-accent-hover" aria-hidden="true" />
                <a href={`tel:${settings.phone}`} className="hover:text-text-primary" dir="ltr">
                  {settings.phone}
                </a>
              </li>
            ) : null}
            {settings.address ? (
              <li className="flex items-center gap-3">
                <MapPin className="size-5 text-accent-hover" aria-hidden="true" />
                <span>{settings.address}</span>
              </li>
            ) : null}
          </ul>
          <SocialLinks instagram={settings.instagram} telegram={settings.telegram} />

          {settings.googleMapsEmbed ? (
            <div
              className="overflow-hidden rounded-[var(--radius-card)] border border-border [&_iframe]:h-full [&_iframe]:w-full"
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
