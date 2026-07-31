import { CalendarClock } from "lucide-react";

import { Container } from "@/components/layout/Container";
import { Section } from "@/components/layout/Section";
import { SectionTitle } from "@/components/shared/SectionTitle";
import { Timeline } from "@/components/shared/Timeline";
import { EmptyState } from "@/components/shared/EmptyState";
import { Reveal } from "@/components/animations/Reveal";
import type { EventDetail } from "@/features/events/types/event";
import { getDictionary } from "@/lib/i18n/server";

interface EventTimelineSectionProps {
  readonly event: EventDetail | null;
}

/**
 * "What does a Pishtalk evening look like?" homepage section, showing the
 * schedule of the next configured event (docs/03_Information_Architecture.md).
 */
async function EventTimelineSection({ event }: EventTimelineSectionProps) {
  const d = await getDictionary();
  const hasTimeline = Boolean(event?.timeline.length);

  return (
    <Section id="event-timeline" className="bg-surface-secondary" circuit>
      <Container className="flex flex-col gap-10">
        <Reveal>
          <SectionTitle
            eyebrow={d.timeline.eyebrow}
            title={d.timeline.title}
            description={d.timeline.description}
          />
        </Reveal>
        {hasTimeline && event ? (
          <Reveal delay={0.1}>
            <Timeline items={event.timeline} className="max-w-2xl" />
          </Reveal>
        ) : (
          <Reveal delay={0.1}>
            <EmptyState
              icon={CalendarClock}
              title={d.timeline.emptyTitle}
              description={d.timeline.emptyDescription}
            />
          </Reveal>
        )}
      </Container>
    </Section>
  );
}

export { EventTimelineSection };
