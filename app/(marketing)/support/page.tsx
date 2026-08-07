import type { Metadata } from "next";
import Image from "next/image";
import { HandHeart } from "lucide-react";

import { Container } from "@/components/layout/Container";
import { Section } from "@/components/layout/Section";
import { EmptyState } from "@/components/shared/EmptyState";
import { Breadcrumbs } from "@/components/shared/Breadcrumbs";
import { Card } from "@/components/ui/Card";
import { Reveal } from "@/components/animations/Reveal";
import { getSponsors } from "@/lib/support";
import { getDictionary, getLocaleContext } from "@/lib/i18n/server";
import { pick } from "@/lib/i18n/content";
import { SITE_URL } from "@/lib/constants";

// Prevents this page from being statically prerendered at Docker build time (when the DB may be empty/unreachable) and cached forever.
export const dynamic = "force-dynamic";

export async function generateMetadata(): Promise<Metadata> {
  const d = await getDictionary();

  return {
    title: d.support.pageTitle,
    description: d.support.metaDescription,
    alternates: { canonical: `${SITE_URL}/support` },
  };
}

export default async function SupportPage() {
  const { locale, dictionary: d } = await getLocaleContext();
  const sponsors = await getSponsors();

  return (
    <Section className="pt-12" circuit>
      <Container className="flex flex-col gap-10">
        <Breadcrumbs items={[{ label: d.support.pageTitle }]} />
        <div className="flex flex-col gap-3">
          <h1 className="text-3xl font-bold text-text-primary sm:text-4xl">
            {d.support.pageTitle}
          </h1>
          <p className="max-w-2xl text-lg text-text-secondary">{d.support.lead}</p>
        </div>

        {sponsors.length > 0 ? (
          <div className="flex flex-col gap-5">
            <h2 className="text-xl font-bold text-text-primary">{d.support.supportersTitle}</h2>
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {sponsors.map((sponsor, index) => {
                const description = pick(locale, sponsor.description, sponsor.descriptionEn);
                const content = (
                  <Card className="group flex h-full flex-col items-center gap-4 p-6 text-center transition-all duration-300 hover:-translate-y-1.5 hover:border-accent/40 hover:shadow-[0_16px_40px_-24px_rgba(244,185,66,0.55)]">
                    {sponsor.logo ? (
                      <Image
                        src={sponsor.logo}
                        alt={sponsor.name}
                        width={120}
                        height={120}
                        className="size-24 rounded-xl object-contain"
                      />
                    ) : (
                      <div
                        aria-hidden="true"
                        className="flex size-24 items-center justify-center rounded-xl bg-accent/15 text-2xl font-bold text-accent-hover"
                      >
                        {sponsor.name.slice(0, 1)}
                      </div>
                    )}
                    <div className="flex flex-col gap-1">
                      <p className="font-medium text-text-primary">{sponsor.name}</p>
                      {description ? (
                        <p className="text-sm text-text-secondary">{description}</p>
                      ) : null}
                    </div>
                  </Card>
                );

                return (
                  <Reveal key={sponsor.id} delay={index * 0.08} className="h-full">
                    {sponsor.url ? (
                      <a
                        href={sponsor.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="block h-full"
                      >
                        {content}
                      </a>
                    ) : (
                      content
                    )}
                  </Reveal>
                );
              })}
            </div>
          </div>
        ) : (
          <EmptyState
            icon={HandHeart}
            title={d.support.emptyTitle}
            description={d.support.emptyDescription}
          />
        )}
      </Container>
    </Section>
  );
}
