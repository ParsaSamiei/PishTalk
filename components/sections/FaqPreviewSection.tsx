import Link from "next/link";
import { HelpCircle } from "lucide-react";

import { Container } from "@/components/layout/Container";
import { Section } from "@/components/layout/Section";
import { SectionTitle } from "@/components/shared/SectionTitle";
import { EmptyState } from "@/components/shared/EmptyState";
import { ForwardArrow } from "@/components/shared/DirectionalIcon";
import {
  Accordion,
  AccordionItem,
  AccordionTrigger,
  AccordionContent,
} from "@/components/ui/Accordion";
import { Button } from "@/components/ui/Button";
import { Reveal } from "@/components/animations/Reveal";
import type { FaqItem } from "@/features/faq/types/faq";
import { pick } from "@/lib/i18n/content";
import { getLocaleContext } from "@/lib/i18n/server";

interface FaqPreviewSectionProps {
  readonly faqs: readonly FaqItem[];
}

/**
 * Five-item FAQ accordion on the homepage, per
 * docs/03_Information_Architecture.md ("FAQ Preview: Accordion, Five Items").
 */
async function FaqPreviewSection({ faqs }: FaqPreviewSectionProps) {
  const { locale, dictionary: d } = await getLocaleContext();

  return (
    <Section id="faq" className="bg-surface-secondary" circuit>
      <Container className="mx-auto flex max-w-3xl flex-col gap-10">
        <Reveal className="mx-auto">
          <SectionTitle
            eyebrow={d.faq.previewEyebrow}
            title={d.faq.previewTitle}
            align="center"
          />
        </Reveal>

        {faqs.length > 0 ? (
          <Reveal delay={0.1}>
            <Accordion
              type="single"
              collapsible
              className="flex flex-col gap-3"
            >
              {faqs.map((faq) => (
                <AccordionItem
                  key={faq.id}
                  value={faq.id}
                  className="group overflow-hidden rounded-card border border-border bg-surface px-6 transition-colors duration-300 data-[state=open]:border-accent/40 data-[state=open]:shadow-[0_16px_40px_-24px_rgba(244,185,66,0.55)]"
                >
                  <AccordionTrigger className="flex w-full items-center gap-4 py-5 text-start text-base font-medium text-text-primary [&>svg]:transition-transform [&>svg]:duration-300 [&[data-state=open]>svg]:rotate-180">
                    <HelpCircle
                      className="size-5 shrink-0 text-accent-hover"
                      aria-hidden="true"
                    />
                    <span className="flex-1">
                      {pick(locale, faq.question, faq.questionEn)}
                    </span>
                  </AccordionTrigger>
                  <AccordionContent className="pb-5 ps-9 text-text-secondary">
                    {pick(locale, faq.answer, faq.answerEn)}
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </Reveal>
        ) : (
          <Reveal delay={0.1}>
            <EmptyState
              icon={HelpCircle}
              title={d.faq.emptyTitle}
              description={d.faq.emptyDescription}
            />
          </Reveal>
        )}

        {faqs.length > 0 ? (
          <Button
            asChild
            variant="ghost"
            className="mx-auto border border-border-primary hover:border-accent hover:bg-accent/5"
          >
            <Link href="/faq">
              {d.faq.viewAllQuestions}
              <ForwardArrow className="size-4" aria-hidden="true" />
            </Link>
          </Button>
        ) : null}
      </Container>
    </Section>
  );
}

export { FaqPreviewSection };
