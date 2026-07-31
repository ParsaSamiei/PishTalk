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
import { getDictionary, getLocaleContext } from "@/lib/i18n/server";
import { pick } from "@/lib/i18n/content";
import { SITE_URL } from "@/lib/constants";

// Prevents this page from being statically prerendered at Docker build time (when the DB may be empty/unreachable) and cached forever.
export const dynamic = "force-dynamic";

export async function generateMetadata(): Promise<Metadata> {
  const d = await getDictionary();

  return {
    title: d.faq.pageTitle,
    description: d.faq.metaDescription,
    alternates: { canonical: `${SITE_URL}/faq` },
  };
}

export default async function FaqPage() {
  const { locale, dictionary: d } = await getLocaleContext();
  const faqs = await getFaqs();

  const localized = faqs.map((faq) => ({
    id: faq.id,
    question: pick(locale, faq.question, faq.questionEn),
    answer: pick(locale, faq.answer, faq.answerEn),
  }));

  const jsonLd = localized.length
    ? {
        "@context": "https://schema.org",
        "@type": "FAQPage",
        mainEntity: localized.map((faq) => ({
          "@type": "Question",
          name: faq.question,
          acceptedAnswer: { "@type": "Answer", text: faq.answer },
        })),
      }
    : null;

  return (
    <Section className="pt-12" circuit>
      <Container className="mx-auto flex max-w-3xl flex-col gap-10">
        {jsonLd ? (
          <script
            type="application/ld+json"
            dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
          />
        ) : null}
        <Breadcrumbs items={[{ label: d.faq.pageTitle }]} />
        <div className="flex flex-col gap-3">
          <h1 className="text-3xl font-bold text-text-primary sm:text-4xl">
            {d.faq.pageTitle}
          </h1>
          <p className="text-lg text-text-secondary">{d.faq.lead}</p>
        </div>

        {localized.length > 0 ? (
          <Accordion
            type="single"
            collapsible
            className="rounded-[var(--radius-card)] border border-border bg-surface px-6"
          >
            {localized.map((faq) => (
              <AccordionItem key={faq.id} value={faq.id}>
                <AccordionTrigger>{faq.question}</AccordionTrigger>
                <AccordionContent>{faq.answer}</AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        ) : (
          <EmptyState
            icon={HelpCircle}
            title={d.faq.emptyTitle}
            description={d.faq.emptyDescription}
          />
        )}
      </Container>
    </Section>
  );
}
