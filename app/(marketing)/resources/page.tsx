import type { Metadata } from "next";
import { BookOpen } from "lucide-react";

import { Container } from "@/components/layout/Container";
import { Section } from "@/components/layout/Section";
import { EmptyState } from "@/components/shared/EmptyState";
import { Breadcrumbs } from "@/components/shared/Breadcrumbs";
import { ResourceCard } from "@/components/cards/ResourceCard";
import { prisma } from "@/lib/prisma";
import { SITE_URL } from "@/lib/constants";
import type { ResourceSummary } from "@/features/resources/types/resource";

export const metadata: Metadata = {
  title: "منابع آموزشی",
  description: "اسلایدها، مقالات و لینک‌های آموزشی رویدادهای پیشتاک.",
  alternates: { canonical: `${SITE_URL}/resources` },
};

/**
 * Resources are sorted alphabetically per docs/05_DATABASE.md ("Sorting:
 * Resources: Alphabetical"), and grouped by event vs. general per
 * docs/03_Information_Architecture.md ("Grouped by Event / General
 * Resources").
 */
async function getGroupedResources() {
  try {
    const resources = await prisma.resource.findMany({
      where: { deletedAt: null },
      orderBy: { title: "asc" },
      include: { event: { select: { title: true } } },
    });

    const general: ResourceSummary[] = [];
    const byEvent = new Map<string, { eventTitle: string; resources: ResourceSummary[] }>();

    for (const resource of resources) {
      const summary: ResourceSummary = {
        id: resource.id,
        title: resource.title,
        description: resource.description,
        resourceType: resource.resourceType,
        fileUrl: resource.fileUrl,
        externalUrl: resource.externalUrl,
      };

      if (resource.eventId && resource.event) {
        const group = byEvent.get(resource.eventId) ?? {
          eventTitle: resource.event.title,
          resources: [] as ResourceSummary[],
        };
        group.resources.push(summary);
        byEvent.set(resource.eventId, group);
      } else {
        general.push(summary);
      }
    }

    return { general, eventGroups: Array.from(byEvent.values()) };
  } catch {
    return { general: [], eventGroups: [] };
  }
}

export default async function ResourcesPage() {
  const { general, eventGroups } = await getGroupedResources();
  const isEmpty = general.length === 0 && eventGroups.length === 0;

  return (
    <Section className="pt-12">
      <Container className="flex flex-col gap-14">
        <Breadcrumbs items={[{ label: "منابع آموزشی" }]} />
        <div className="flex flex-col gap-3">
          <h1 className="text-3xl font-bold text-text-primary sm:text-4xl">منابع آموزشی</h1>
          <p className="max-w-2xl text-lg text-text-secondary">
            اسلایدها، مقالات و لینک‌های به‌جامانده از رویدادهای پیشتاک.
          </p>
        </div>

        {isEmpty ? (
          <EmptyState
            icon={BookOpen}
            title="هنوز منبعی منتشر نشده است"
            description="منابع رویدادها پس از انتشار اینجا در دسترس خواهند بود."
          />
        ) : (
          <>
            {general.length > 0 ? (
              <div className="flex flex-col gap-6">
                <h2 className="text-xl font-bold text-text-primary">منابع عمومی</h2>
                <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                  {general.map((resource) => (
                    <ResourceCard key={resource.id} resource={resource} />
                  ))}
                </div>
              </div>
            ) : null}

            {eventGroups.map((group) => (
              <div key={group.eventTitle} className="flex flex-col gap-6">
                <h2 className="text-xl font-bold text-text-primary">{group.eventTitle}</h2>
                <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                  {group.resources.map((resource) => (
                    <ResourceCard key={resource.id} resource={resource} />
                  ))}
                </div>
              </div>
            ))}
          </>
        )}
      </Container>
    </Section>
  );
}
