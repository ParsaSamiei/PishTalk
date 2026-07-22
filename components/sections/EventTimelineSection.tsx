import { CalendarClock } from "lucide-react";

import { Container } from "@/components/layout/Container";
import { Section } from "@/components/layout/Section";
import { SectionTitle } from "@/components/shared/SectionTitle";
import { Timeline } from "@/components/shared/Timeline";
import { EmptyState } from "@/components/shared/EmptyState";
import type { EventDetail } from "@/features/events/types/event";

interface EventTimelineSectionProps {
  readonly event: EventDetail | null;
}

/**
 * "What does a Pishtalk evening look like?" homepage section, showing the
 * schedule of the next configured event (docs/03_Information_Architecture.md).
 */
function EventTimelineSection({ event }: EventTimelineSectionProps) {
  const hasTimeline = Boolean(event?.timeline.length);

  return (
    <Section id="event-timeline" className="bg-surface-secondary">
      <Container className="flex flex-col gap-10">
        <SectionTitle
          eyebrow="برنامه رویداد"
          title="یک عصر پیشتاک چطور می‌گذرد"
          description="از ورود تا شبکه‌سازی، این‌طور یک رویداد پیشتاک را تجربه خواهید کرد."
        />
        {hasTimeline && event ? (
          <Timeline items={event.timeline} className="max-w-2xl" />
        ) : (
          <EmptyState
            icon={CalendarClock}
            title="برنامه رویداد بعدی هنوز اعلام نشده است"
            description="زمان‌بندی کامل رویداد به‌محض قطعی شدن، همین‌جا نمایش داده می‌شود."
          />
        )}
      </Container>
    </Section>
  );
}

export { EventTimelineSection };
