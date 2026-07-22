import Link from "next/link";
import { ShieldCheck, ArrowLeft, Heart, Users, MessageCircle } from "lucide-react";
import type { LucideIcon } from "lucide-react";

import { Container } from "@/components/layout/Container";
import { Section } from "@/components/layout/Section";
import { SectionTitle } from "@/components/shared/SectionTitle";
import { EmptyState } from "@/components/shared/EmptyState";
import { Card, CardHeader, CardTitle, CardDescription } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import type { RuleItem } from "@/types/rule";

const ICON_MAP: Record<string, LucideIcon> = {
  respect: Heart,
  community: Users,
  discussion: MessageCircle,
};

interface RulesPreviewSectionProps {
  readonly rules: readonly RuleItem[];
}

function RulesPreviewSection({ rules }: RulesPreviewSectionProps) {
  return (
    <Section id="rules">
      <Container className="flex flex-col gap-10">
        <div className="flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-end">
          <SectionTitle eyebrow="قوانین" title="قوانین حضور در پیشتاک" />
          {rules.length > 0 ? (
            <Button asChild variant="ghost">
              <Link href="/rules">
                مشاهده کامل قوانین
                <ArrowLeft className="size-4" aria-hidden="true" />
              </Link>
            </Button>
          ) : null}
        </div>

        {rules.length > 0 ? (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {rules.map((rule) => {
              const Icon = (rule.icon && ICON_MAP[rule.icon]) || ShieldCheck;
              return (
                <Card key={rule.id}>
                  <CardHeader>
                    <div className="mb-2 flex size-11 items-center justify-center rounded-xl bg-accent/15 text-accent-hover">
                      <Icon className="size-5" aria-hidden="true" />
                    </div>
                    <CardTitle>{rule.title}</CardTitle>
                  </CardHeader>
                  <CardDescription>{rule.description}</CardDescription>
                </Card>
              );
            })}
          </div>
        ) : (
          <EmptyState
            icon={ShieldCheck}
            title="قوانین به‌زودی منتشر می‌شود"
            description="قوانین حضور در رویدادهای پیشتاک به‌زودی اینجا نمایش داده خواهد شد."
          />
        )}
      </Container>
    </Section>
  );
}

export { RulesPreviewSection };
