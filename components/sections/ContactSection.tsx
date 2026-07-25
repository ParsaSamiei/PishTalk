import { Mail, MapPin, Phone, Bot } from "lucide-react";

import { Container } from "@/components/layout/Container";
import { Section } from "@/components/layout/Section";
import { SectionTitle } from "@/components/shared/SectionTitle";
import { SocialLinks } from "@/components/shared/SocialLinks";
import { ContactForm } from "@/features/contact/components/ContactForm";
import { Reveal } from "@/components/animations/Reveal";
import { FloatingIcon } from "@/components/illustrations/FloatingIcon";
import { CONTACT_PHONE } from "@/lib/constants";

interface ContactSectionProps {
  readonly contactEmail?: string | null;
  readonly phone?: string | null;
  readonly address?: string | null;
  readonly instagram?: string | null;
  readonly telegram?: string | null;
}

/**
 * "How do I reach the organizers?" homepage section — the last stop on the
 * page, closing with a quiet callback to the Hero's circuit motif.
 */
function ContactSection({
  contactEmail,
  phone,
  address,
  instagram,
  telegram,
}: ContactSectionProps) {
  const phoneNumber = phone ?? CONTACT_PHONE;

  return (
    <Section id="contact" className="bg-surface-secondary" circuit>
      <FloatingIcon
        icon={Bot}
        size="sm"
        className="hidden border-border bg-surface text-accent-hover sm:flex top-[8%] inset-e-[6%]"
        style={{ animationDelay: "-2s" }}
      />

      <Container className="relative grid gap-12 lg:grid-cols-2">
        <Reveal className="flex flex-col gap-6">
          <SectionTitle
            eyebrow="تماس با ما"
            title="سوالی دارید؟"
            description="برای همکاری، سخنرانی یا هر سوال دیگری، پیام بگذارید."
          />
          <ul className="flex flex-col gap-4 text-text-secondary">
            {contactEmail ? (
              <li>
                <a
                  href={`mailto:${contactEmail}`}
                  className="group flex items-center gap-3 transition-colors hover:text-text-primary"
                >
                  <span className="flex size-10 shrink-0 items-center justify-center rounded-full border border-border transition-colors duration-150 group-hover:border-accent group-hover:text-accent-hover">
                    <Mail className="size-4" aria-hidden="true" />
                  </span>
                  {contactEmail}
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
            {address ? (
              <li className="flex items-center gap-3">
                <span className="flex size-10 shrink-0 items-center justify-center rounded-full border border-border">
                  <MapPin
                    className="size-4 text-text-secondary"
                    aria-hidden="true"
                  />
                </span>
                <span>{address}</span>
              </li>
            ) : null}
          </ul>
          <SocialLinks instagram={instagram} telegram={telegram} />
        </Reveal>

        <Reveal delay={0.12}>
          <ContactForm />
        </Reveal>
      </Container>
    </Section>
  );
}

export { ContactSection };
