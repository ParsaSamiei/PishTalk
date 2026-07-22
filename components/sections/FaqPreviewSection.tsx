import Link from "next/link";
import { HelpCircle, ArrowLeft } from "lucide-react";

import { Container } from "@/components/layout/Container";
import { Section } from "@/components/layout/Section";
import { SectionTitle } from "@/components/shared/SectionTitle";
import { EmptyState } from "@/components/shared/EmptyState";
import {
  Accordion,
  AccordionItem,
  AccordionTrigger,
  AccordionContent,
} from "@/components/ui/Accordion";
import { Button } from "@/components/ui/Button";
import type { FaqItem } from "@/features/faq/types/faq";

interface FaqPreviewSectionProps {
  readonly faqs: readonly FaqItem[];
}

/**
 * Five-item FAQ accordion on the homepage, per
 * docs/03_Information_Architecture.md ("FAQ Preview: Accordion, Five Items").
 */
function FaqPreviewSection({ faqs }: FaqPreviewSectionProps) {
  return (
    <Section id="faq" className="bg-surface-secondary">
      <Container className="mx-auto flex max-w-3xl flex-col gap-10">
        <SectionTitle
          eyebrow="سوالات متداول"
          title="سوالات پرتکرار"
          align="center"
          className="mx-auto"
        />

        {faqs.length > 0 ? (
          <Accordion type="single" collapsible className="rounded-[var(--radius-card)] border border-border bg-surface px-6">
            {faqs.map((faq) => (
              <AccordionItem key={faq.id} value={faq.id}>
                <AccordionTrigger>{faq.question}</AccordionTrigger>
                <AccordionContent>{faq.answer}</AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        ) : (
          <EmptyState
            icon={HelpCircle}
            title="سوالی ثبت نشده است"
            description="پرتکرارترین سوالات شرکت‌کنندگان به‌زودی اینجا پاسخ داده می‌شود."
          />
        )}

        {faqs.length > 0 ? (
          <Button asChild variant="ghost" className="mx-auto">
            <Link href="/faq">
              مشاهده همه سوالات
              <ArrowLeft className="size-4" aria-hidden="true" />
            </Link>
          </Button>
        ) : null}
      </Container>
    </Section>
  );
}

export { FaqPreviewSection };
