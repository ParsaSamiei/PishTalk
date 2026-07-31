import Link from "next/link";
import { BookOpen } from "lucide-react";

import { Container } from "@/components/layout/Container";
import { Section } from "@/components/layout/Section";
import { SectionTitle } from "@/components/shared/SectionTitle";
import { EmptyState } from "@/components/shared/EmptyState";
import { ForwardArrow } from "@/components/shared/DirectionalIcon";
import { ResourceCard } from "@/components/cards/ResourceCard";
import { Button } from "@/components/ui/Button";
import { Reveal } from "@/components/animations/Reveal";
import type { ResourceSummary } from "@/features/resources/types/resource";
import { getDictionary } from "@/lib/i18n/server";

interface ResourcesSectionProps {
  readonly resources: readonly ResourceSummary[];
}

async function ResourcesSection({ resources }: ResourcesSectionProps) {
  const d = await getDictionary();

  return (
    <Section id="resources" circuit>
      <Container className="flex flex-col gap-10">
        <Reveal className="flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-end">
          <SectionTitle
            eyebrow={d.resources.sectionEyebrow}
            title={d.resources.sectionTitle}
          />
          {resources.length > 0 ? (
            <Button asChild variant="ghost">
              <Link href="/resources">
                {d.resources.viewAllResources}
                <ForwardArrow className="size-4" aria-hidden="true" />
              </Link>
            </Button>
          ) : null}
        </Reveal>

        {resources.length > 0 ? (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {resources.map((resource, index) => (
              <Reveal key={resource.id} delay={index * 0.08} className="h-full">
                <ResourceCard resource={resource} />
              </Reveal>
            ))}
          </div>
        ) : (
          <Reveal delay={0.1}>
            <EmptyState
              icon={BookOpen}
              title={d.resources.emptyTitle}
              description={d.resources.homeEmptyDescription}
            />
          </Reveal>
        )}
      </Container>
    </Section>
  );
}

export { ResourcesSection };
