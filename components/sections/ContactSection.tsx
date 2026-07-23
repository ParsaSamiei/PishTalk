import { Mail, MapPin, Phone, Bot } from "lucide-react";

import { Container } from "@/components/layout/Container";
import { Section } from "@/components/layout/Section";
import { SectionTitle } from "@/components/shared/SectionTitle";
import { SocialLinks } from "@/components/shared/SocialLinks";
import { ContactForm } from "@/features/contact/components/ContactForm";
import { Reveal } from "@/components/animations/Reveal";
import { CircuitBackground } from "@/components/illustrations/CircuitBackground";
import { FloatingIcon } from "@/components/illustrations/FloatingIcon";

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
  return (
    <Section id="contact" className="relative overflow-hidden bg-surface-secondary">
      <CircuitBackground
        id="contact"
        className="text-primary/[0.04] dark:text-white/[0.04]"
      />
      <FloatingIcon
        icon={Bot}
        size="sm"
        className="hidden border-border bg-surface text-accent-hover sm:flex top-[8%] end-[6%]"
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
        </Reveal>

        <Reveal delay={0.12}>
          <ContactForm />
        </Reveal>
      </Container>
    </Section>
  );
}

export { ContactSection };
