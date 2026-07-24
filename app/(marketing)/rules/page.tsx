import type { Metadata } from "next";
import { ShieldCheck, Heart, Users, MessageCircle } from "lucide-react";
import type { LucideIcon } from "lucide-react";

import { Container } from "@/components/layout/Container";
import { Section } from "@/components/layout/Section";
import { EmptyState } from "@/components/shared/EmptyState";
import { Breadcrumbs } from "@/components/shared/Breadcrumbs";
import { Card, CardHeader, CardTitle, CardDescription } from "@/components/ui/Card";
import { getRules } from "@/lib/rules";
import { SITE_URL } from "@/lib/constants";

export const metadata: Metadata = {
  title: "قوانین",
  description: "قوانین حضور در رویدادهای پیشتاک.",
  alternates: { canonical: `${SITE_URL}/rules` },
};

const ICON_MAP: Record<string, LucideIcon> = {
  respect: Heart,
  community: Users,
  discussion: MessageCircle,
};

export default async function RulesPage() {
  const rules = await getRules();

  return (
    <Section className="pt-12">
      <Container className="flex flex-col gap-10">
        <Breadcrumbs items={[{ label: "قوانین" }]} />
        <div className="flex flex-col gap-3">
          <h1 className="text-3xl font-bold text-text-primary sm:text-4xl">قوانین</h1>
          <p className="max-w-2xl text-lg text-text-secondary">
            برای اینکه پیشتاک فضایی امن و مفید برای همه باشد، لطفاً این قوانین را رعایت کنید.
          </p>
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
