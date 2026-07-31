import type { Metadata } from "next";
import Link from "next/link";

import { Container } from "@/components/layout/Container";
import { Section } from "@/components/layout/Section";
import { Breadcrumbs } from "@/components/shared/Breadcrumbs";
import { Button } from "@/components/ui/Button";
import { getDictionary } from "@/lib/i18n/server";
import { PISHNAM_URL, SITE_URL } from "@/lib/constants";

export async function generateMetadata(): Promise<Metadata> {
  const d = await getDictionary();

  return {
    title: d.about.pageTitle,
    description: d.about.pageMetaDescription,
    alternates: { canonical: `${SITE_URL}/about` },
  };
}

export default async function AboutPage() {
  const d = await getDictionary();

  return (
    <Section className="pt-12" circuit>
      <Container className="mx-auto flex max-w-3xl flex-col gap-8">
        <Breadcrumbs items={[{ label: d.about.pageTitle }]} />
        <div className="flex flex-col gap-3">
          <h1 className="text-3xl font-bold text-text-primary sm:text-4xl">
            {d.about.pageHeading}
          </h1>
          <p className="text-lg text-text-secondary">{d.about.pageLead}</p>
        </div>

        <div className="flex flex-col gap-6 leading-relaxed text-text-secondary">
          <p>{d.about.paragraph1}</p>
          <p>{d.about.paragraph2}</p>
          <p>{d.about.paragraph3}</p>
        </div>

        <Button asChild variant="outline" className="self-start">
          <a href={PISHNAM_URL} target="_blank" rel="noreferrer noopener">
            {d.about.pishnamCta}
          </a>
        </Button>

        <div className="flex flex-col gap-3 rounded-card border border-border bg-surface-secondary p-6 sm:flex-row sm:items-center sm:justify-between">
          <p className="text-text-primary">{d.about.joinPrompt}</p>
          <Button asChild>
            <Link href="/events">{d.about.seeEvents}</Link>
          </Button>
        </div>
      </Container>
    </Section>
  );
}
