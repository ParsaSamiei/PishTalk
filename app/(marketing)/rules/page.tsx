import type { Metadata } from "next";
import { ShieldCheck, Heart, Users, MessageCircle } from "lucide-react";
import type { LucideIcon } from "lucide-react";

import { Container } from "@/components/layout/Container";
import { Section } from "@/components/layout/Section";
import { EmptyState } from "@/components/shared/EmptyState";
import { Breadcrumbs } from "@/components/shared/Breadcrumbs";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/Card";
import { Reveal } from "@/components/animations/Reveal";
import { getRules } from "@/lib/rules";
import { getDictionary, getLocaleContext } from "@/lib/i18n/server";
import { pick } from "@/lib/i18n/content";
import { SITE_URL } from "@/lib/constants";

// Prevents this page from being statically prerendered at Docker build time (when the DB may be empty/unreachable) and cached forever.
export const dynamic = "force-dynamic";

export async function generateMetadata(): Promise<Metadata> {
  const d = await getDictionary();

  return {
    title: d.rules.pageTitle,
    description: d.rules.metaDescription,
    alternates: { canonical: `${SITE_URL}/rules` },
  };
}

const ICON_MAP: Record<string, LucideIcon> = {
  respect: Heart,
  community: Users,
  discussion: MessageCircle,
};

export default async function RulesPage() {
  const { locale, dictionary: d } = await getLocaleContext();
  const rules = await getRules();

  return (
    <Section className="pt-12" circuit>
      <Container className="flex flex-col gap-10">
        <Breadcrumbs items={[{ label: d.rules.pageTitle }]} />
        <div className="flex flex-col gap-3">
          <h1 className="text-3xl font-bold text-text-primary sm:text-4xl">
            {d.rules.pageTitle}
          </h1>
          <p className="max-w-2xl text-lg text-text-secondary">
            {d.rules.lead}
          </p>
        </div>

        {rules.length > 0 ? (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {rules.map((rule, index) => {
              const Icon = (rule.icon && ICON_MAP[rule.icon]) || ShieldCheck;
              return (
                <Reveal key={rule.id} delay={index * 0.08} className="h-full">
                  <Card className="group h-full overflow-hidden transition-all duration-300 hover:-translate-y-1.5 hover:border-accent/40 hover:shadow-[0_16px_40px_-24px_rgba(244,185,66,0.55)]">
                    <div className="h-1 w-full scale-x-0 bg-linear-to-l from-accent to-sky-400 transition-transform duration-300 group-hover:scale-x-100" />
                    <CardHeader>
                      <div className="mb-2 flex size-11 items-center justify-center rounded-xl bg-accent/15 text-accent-hover transition-transform duration-300 group-hover:-rotate-6 group-hover:scale-110">
                        <Icon className="size-5" aria-hidden="true" />
                      </div>
                      <CardTitle>
                        {pick(locale, rule.title, rule.titleEn)}
                      </CardTitle>
                    </CardHeader>
                    <CardDescription>
                      {pick(locale, rule.description, rule.descriptionEn)}
                    </CardDescription>
                  </Card>
                </Reveal>
              );
            })}
          </div>
        ) : (
          <EmptyState
            icon={ShieldCheck}
            title={d.rules.emptyTitle}
            description={d.rules.emptyDescription}
          />
        )}
      </Container>
    </Section>
  );
}
