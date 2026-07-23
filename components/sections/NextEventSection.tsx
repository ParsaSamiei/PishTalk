import Link from "next/link";
import { Calendar, MapPin } from "lucide-react";

import { Container } from "@/components/layout/Container";
import { Section } from "@/components/layout/Section";
import { SectionTitle } from "@/components/shared/SectionTitle";
import { EmptyState } from "@/components/shared/EmptyState";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Countdown } from "@/components/shared/Countdown";
import { Reveal } from "@/components/animations/Reveal";
import { CircuitBackground } from "@/components/illustrations/CircuitBackground";
import type { EventDetail } from "@/features/events/types/event";
import { formatEventDate, formatWeekday } from "@/utils/formatDate";

interface NextEventSectionProps {
  readonly event: EventDetail | null;
}

/**
 * "What is happening next?" — per docs/09_DEVELOPMENT_GUIDELINES.md,
 * every section answers exactly one question. `scroll-mt-24` keeps this
 * section clear of the sticky Navbar when the Hero's scroll cue jumps here.
 */
function NextEventSection({ event }: NextEventSectionProps) {
  return (
    <Section id="next-event" className="scroll-mt-24">
      <Container className="flex flex-col gap-10">
        <Reveal>
          <SectionTitle eyebrow="رویداد بعدی" title="در رویداد پیش رو ما را همراهی کنید" />
        </Reveal>

        {event ? (
          <Reveal delay={0.1}>
            <Card className="grid gap-8 p-8 lg:grid-cols-[1.2fr_1fr] lg:p-10">
              <div className="flex flex-col gap-5">
                <h3 className="text-2xl font-bold text-text-primary sm:text-3xl">
                  {event.title}
                </h3>
                {event.subtitle ? (
                  <p className="text-text-secondary">{event.subtitle}</p>
                ) : null}

                <div className="flex flex-col gap-3 text-sm text-text-secondary sm:flex-row sm:gap-8">
                  <span className="flex items-center gap-2">
                    <Calendar className="size-4 text-accent-hover" aria-hidden="true" />
                    {formatWeekday(event.date)}، {formatEventDate(event.date)} — {event.startTime}
                  </span>
                  <span className="flex items-center gap-2">
                    <MapPin className="size-4 text-accent-hover" aria-hidden="true" />
                    {event.location}
                  </span>
                </div>

                <div className="mt-2 flex flex-col gap-3 sm:flex-row">
                  <Button asChild size="lg">
                    <Link href={`/events/${event.slug}#register`}>ثبت نام</Link>
                  </Button>
                  <Button asChild variant="outline" size="lg">
                    <Link href={`/events/${event.slug}`}>مشاهده جزئیات</Link>
                  </Button>
                </div>
              </div>

              <div className="relative flex items-center justify-center overflow-hidden rounded-[var(--radius-card)] bg-primary p-6">
                <CircuitBackground id="next-event" className="text-white/[0.08]" />
                <Countdown target={event.date} className="relative" />
              </div>
            </Card>
          </Reveal>
        ) : (
          <Reveal delay={0.1}>
            <EmptyState
              icon={Calendar}
              title="رویداد بعدی به‌زودی معرفی خواهد شد"
              description="برای اطلاع از تاریخ رویداد بعدی، صفحه رویدادها را دنبال کنید."
              action={
                <Button asChild variant="outline">
                  <Link href="/events">مشاهده رویدادهای گذشته</Link>
                </Button>
              }
            />
          </Reveal>
        )}
      </Container>
    </Section>
  );
}

export { NextEventSection };
