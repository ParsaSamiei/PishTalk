import { Mail, MapPin, Phone } from "lucide-react";

import { Container } from "@/components/layout/Container";
import { Section } from "@/components/layout/Section";
import { SectionTitle } from "@/components/shared/SectionTitle";
import { SocialLinks } from "@/components/shared/SocialLinks";
import { ContactForm } from "@/features/contact/components/ContactForm";

interface ContactSectionProps {
  readonly contactEmail?: string | null;
  readonly phone?: string | null;
  readonly address?: string | null;
  readonly instagram?: string | null;
  readonly telegram?: string | null;
}

/**
 * "How do I reach the organizers?" homepage section.
 */
function ContactSection({
  contactEmail,
  phone,
  address,
  instagram,
  telegram,
}: ContactSectionProps) {
  return (
    <Section id="contact">
      <Container className="grid gap-12 lg:grid-cols-2">
        <div className="flex flex-col gap-6">
          <SectionTitle
            eyebrow="تماس با ما"
            title="سوالی دارید؟"
            description="برای همکاری، سخنرانی یا هر سوال دیگری، پیام بگذارید."
          />
          <ul className="flex flex-col gap-4 text-text-secondary">
            {contactEmail ? (
              <li className="flex items-center gap-3">
                <Mail className="size-5 text-accent-hover" aria-hidden="true" />
                <a href={`mailto:${contactEmail}`} className="hover:text-text-primary">
                  {contactEmail}
                </a>
              </li>
            ) : null}
            {phone ? (
              <li className="flex items-center gap-3">
                <Phone className="size-5 text-accent-hover" aria-hidden="true" />
                <a href={`tel:${phone}`} className="hover:text-text-primary" dir="ltr">
                  {phone}
                </a>
              </li>
            ) : null}
            {address ? (
              <li className="flex items-center gap-3">
                <MapPin className="size-5 text-accent-hover" aria-hidden="true" />
                <span>{address}</span>
              </li>
            ) : null}
          </ul>
          <SocialLinks instagram={instagram} telegram={telegram} />
        </div>

        <ContactForm />
      </Container>
    </Section>
  );
}

export { ContactSection };
