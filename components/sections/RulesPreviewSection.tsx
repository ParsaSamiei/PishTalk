import Link from "next/link";
import { ShieldCheck, Heart, Users, MessageCircle } from "lucide-react";
import type { LucideIcon } from "lucide-react";

import { Container } from "@/components/layout/Container";
import { Section } from "@/components/layout/Section";
import { SectionTitle } from "@/components/shared/SectionTitle";
import { EmptyState } from "@/components/shared/EmptyState";
import { ForwardArrow } from "@/components/shared/DirectionalIcon";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Reveal } from "@/components/animations/Reveal";
import type { RuleItem } from "@/types/rule";
import { pick } from "@/lib/i18n/content";
import { getLocaleContext } from "@/lib/i18n/server";

const ICON_MAP: Record<string, LucideIcon> = {
  respect: Heart,
  community: Users,
  discussion: MessageCircle,
};

interface RulesPreviewSectionProps {
  readonly rules: readonly RuleItem[];
}

async function RulesPreviewSection({ rules }: RulesPreviewSectionProps) {
  const { locale, dictionary: d } = await getLocaleContext();

  return (
    <Section id="rules" circuit>
      <Container className="flex flex-col gap-10">
        <Reveal className="flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-end">
          <SectionTitle
            eyebrow={d.rules.pageTitle}
            title={d.rules.previewTitle}
          />
          {rules.length > 0 ? (
            <Button
              asChild
              variant="ghost"
              className="border border-border-primary hover:border-accent hover:bg-accent/5"
            >
              <Link href="/rules">
                {d.rules.viewFull}
                <ForwardArrow className="size-4" aria-hidden="true" />
              </Link>
            </Button>
          ) : null}
        </Reveal>

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
          <Reveal delay={0.1}>
            <EmptyState
              icon={ShieldCheck}
              title={d.rules.emptyTitle}
              description={d.rules.emptyDescription}
            />
          </Reveal>
        )}
      </Container>
    </Section>
  );
}

export { RulesPreviewSection };
