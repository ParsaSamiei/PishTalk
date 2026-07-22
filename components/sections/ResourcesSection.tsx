import Link from "next/link";
import { BookOpen, ArrowLeft } from "lucide-react";

import { Container } from "@/components/layout/Container";
import { Section } from "@/components/layout/Section";
import { SectionTitle } from "@/components/shared/SectionTitle";
import { EmptyState } from "@/components/shared/EmptyState";
import { ResourceCard } from "@/components/cards/ResourceCard";
import { Button } from "@/components/ui/Button";
import type { ResourceSummary } from "@/features/resources/types/resource";

interface ResourcesSectionProps {
  readonly resources: readonly ResourceSummary[];
}

function ResourcesSection({ resources }: ResourcesSectionProps) {
  return (
    <Section id="resources">
      <Container className="flex flex-col gap-10">
        <div className="flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-end">
          <SectionTitle eyebrow="منابع آموزشی" title="یادگیری را ادامه دهید" />
          {resources.length > 0 ? (
            <Button asChild variant="ghost">
              <Link href="/resources">
                مشاهده همه منابع
                <ArrowLeft className="size-4" aria-hidden="true" />
              </Link>
            </Button>
          ) : null}
        </div>

        {resources.length > 0 ? (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {resources.map((resource) => (
              <ResourceCard key={resource.id} resource={resource} />
            ))}
          </div>
        ) : (
          <EmptyState
            icon={BookOpen}
            title="هنوز منبعی منتشر نشده است"
            description="اسلایدها، مقالات و لینک‌های رویدادها پس از انتشار، اینجا در دسترس خواهند بود."
          />
        )}
      </Container>
    </Section>
  );
}

export { ResourcesSection };
