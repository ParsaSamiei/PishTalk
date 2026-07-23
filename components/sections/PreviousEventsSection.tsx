import Link from "next/link";
import { Archive, ArrowLeft } from "lucide-react";

import { Container } from "@/components/layout/Container";
import { Section } from "@/components/layout/Section";
import { SectionTitle } from "@/components/shared/SectionTitle";
import { EmptyState } from "@/components/shared/EmptyState";
import { EventCard } from "@/components/cards/EventCard";
import { Button } from "@/components/ui/Button";
import { Reveal } from "@/components/animations/Reveal";
import type { EventSummary } from "@/features/events/types/event";

interface PreviousEventsSectionProps {
  readonly events: readonly EventSummary[];
}

/**
 * "What did previous meetups look like?" homepage section.
 */
function PreviousEventsSection({ events }: PreviousEventsSectionProps) {
  return (
    <Section id="previous-events">
      <Container className="flex flex-col gap-10">
        <Reveal className="flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-end">
          <SectionTitle eyebrow="آرشیو" title="رویدادهای گذشته پیشتاک" />
          {events.length > 0 ? (
            <Button asChild variant="ghost">
              <Link href="/events">
                مشاهده همه
                <ArrowLeft className="size-4" aria-hidden="true" />
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
              title="هنوز رویدادی برگزار نشده است"
              description="اولین رویداد پیشتاک به‌زودی برگزار می‌شود و اینجا آرشیو خواهد شد."
            />
          </Reveal>
        )}
      </Container>
    </Section>
  );
}

export { PreviousEventsSection };
