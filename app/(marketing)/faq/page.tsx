import type { Metadata } from "next";
import { HelpCircle } from "lucide-react";

import { Container } from "@/components/layout/Container";
import { Section } from "@/components/layout/Section";
import { EmptyState } from "@/components/shared/EmptyState";
import { Breadcrumbs } from "@/components/shared/Breadcrumbs";
import {
  Accordion,
  AccordionItem,
  AccordionTrigger,
  AccordionContent,
} from "@/components/ui/Accordion";
import { getFaqs } from "@/features/faq/actions/getFaqs";
import { SITE_URL } from "@/lib/constants";

export const metadata: Metadata = {
  title: "سوالات متداول",
  description: "پاسخ سوالات پرتکرار درباره پیشتاک.",
  alternates: { canonical: `${SITE_URL}/faq` },
};

export default async function FaqPage() {
  const faqs = await getFaqs();

  const jsonLd = faqs.length
    ? {
        "@context": "https://schema.org",
        "@type": "FAQPage",
        mainEntity: faqs.map((faq) => ({
          "@type": "Question",
          name: faq.question,
          acceptedAnswer: { "@type": "Answer", text: faq.answer },
        })),
      }
    : null;

  return (
    <Section className="pt-12">
      <Container className="mx-auto flex max-w-3xl flex-col gap-10">
        {jsonLd ? (
          <script
            type="application/ld+json"
            dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
          />
        ) : null}
        <Breadcrumbs items={[{ label: "سوالات متداول" }]} />
        <div className="flex flex-col gap-3">
          <h1 className="text-3xl font-bold text-text-primary sm:text-4xl">سوالات متداول</h1>
          <p className="text-lg text-text-secondary">پاسخ سوالات پرتکرار درباره پیشتاک.</p>
        </div>

        {faqs.length > 0 ? (
          <Accordion
            type="single"
            collapsible
            className="rounded-[var(--radius-card)] border border-border bg-surface px-6"
          >
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
      </Container>
    </Section>
  );
}
