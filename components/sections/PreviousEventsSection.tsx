import Link from "next/link";
import { Archive } from "lucide-react";

import { Container } from "@/components/layout/Container";
import { Section } from "@/components/layout/Section";
import { SectionTitle } from "@/components/shared/SectionTitle";
import { EmptyState } from "@/components/shared/EmptyState";
import { ForwardArrow } from "@/components/shared/DirectionalIcon";
import { EventCard } from "@/components/cards/EventCard";
import { Button } from "@/components/ui/Button";
import { Reveal } from "@/components/animations/Reveal";
import type { EventSummary } from "@/features/events/types/event";
import { getDictionary } from "@/lib/i18n/server";

interface PreviousEventsSectionProps {
  readonly events: readonly EventSummary[];
}

/**
 * "What did previous meetups look like?" homepage section.
 */
async function PreviousEventsSection({ events }: PreviousEventsSectionProps) {
  const d = await getDictionary();

  return (
    <Section id="previous-events" circuit>
      <Container className="flex flex-col gap-10">
        <Reveal className="flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-end">
          <SectionTitle
            eyebrow={d.events.archiveEyebrow}
            title={d.events.archiveTitle}
          />
          {events.length > 0 ? (
            <Button
              asChild
              variant="ghost"
              className="border border-border-primary hover:border-accent hover:bg-accent/5"
            >
              <Link href="/events">
                {d.common.viewAll}
                <ForwardArrow className="size-4" aria-hidden="true" />
              </Link>
            </Button>
          ) : null}
        </Reveal>

        {events.length > 0 ? (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {events.map((event, index) => (
              <Reveal key={event.id} delay={index * 0.08} className="h-full">
                <EventCard event={event} />
              </Reveal>
            ))}
          </div>
        ) : (
          <Reveal delay={0.1}>
            <EmptyState
              icon={Archive}
              title={d.events.archiveEmptyTitle}
              description={d.events.archiveEmptyDescription}
            />
          </Reveal>
        )}
      </Container>
    </Section>
  );
}

export { PreviousEventsSection };
