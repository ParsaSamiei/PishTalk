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
import { GlowOrb } from "@/components/illustrations/GlowOrb";
import type { EventDetail } from "@/features/events/types/event";
import { pick } from "@/lib/i18n/content";
import { getLocaleContext } from "@/lib/i18n/server";
import { formatEventDate, formatWeekday } from "@/utils/formatDate";

interface NextEventSectionProps {
  readonly event: EventDetail | null;
}

/**
 * "What is happening next?" — per docs/09_DEVELOPMENT_GUIDELINES.md,
 * every section answers exactly one question. `scroll-mt-24` keeps this
 * section clear of the sticky Navbar when the Hero's scroll cue jumps here.
 *
 * The countdown panel deliberately mirrors the Hero's own recipe (radial
 * gold glow + circuit backdrop + a floating orb) so it reads as a direct
 * continuation of it. This section skips the shared `circuit` texture at
 * the outer `<Section>` level — layering that fainter, differently-phased
 * grid directly behind a panel that already carries its own denser one
 * was what looked misaligned; one circuit treatment per area reads clean.
 */
async function NextEventSection({ event }: NextEventSectionProps) {
  const { locale, dictionary: d } = await getLocaleContext();
  const subtitle = event
    ? pick(locale, event.subtitle, event.subtitleEn)
    : null;

  return (
    <Section
      id="next-event"
      className="scroll-mt-24 bg-surface-secondary"
      circuit
    >
      <Container className="flex flex-col gap-10">
        <Reveal>
          <SectionTitle
            eyebrow={d.nextEvent.eyebrow}
            title={d.nextEvent.title}
          />
        </Reveal>

        {event ? (
          <Reveal delay={0.1}>
            <Card className="grid gap-8 p-8 lg:grid-cols-[1.2fr_1fr] lg:p-10">
              <div className="flex flex-col gap-5">
                <h3 className="text-2xl font-bold text-text-primary sm:text-3xl">
                  {pick(locale, event.title, event.titleEn)}
                </h3>
                {subtitle ? (
                  <p className="text-text-secondary">{subtitle}</p>
                ) : null}

                <div className="flex flex-col gap-3 text-sm text-text-secondary sm:flex-row sm:gap-8">
                  <span className="flex items-center gap-2">
                    <Calendar
                      className="size-4 text-accent-hover"
                      aria-hidden="true"
                    />
                    {/* Persian separates the weekday with an Arabic comma. */}
                    {formatWeekday(event.date, locale)}
                    {locale === "fa" ? "،" : ","}{" "}
                    {formatEventDate(event.date, locale)} — {event.startTime}
                  </span>
                  <span className="flex items-center gap-2">
                    <MapPin
                      className="size-4 text-accent-hover"
                      aria-hidden="true"
                    />
                    {pick(locale, event.location, event.locationEn)}
                  </span>
                </div>

                <div className="mt-2 flex flex-col gap-3 sm:flex-row">
                  <Button asChild size="lg">
                    <Link href={`/events/${event.slug}#register`}>
                      {d.common.register}
                    </Link>
                  </Button>
                  <Button asChild variant="outline" size="lg">
                    <Link href={`/events/${event.slug}`}>
                      {d.common.details}
                    </Link>
                  </Button>
                </div>
              </div>

              <div className="relative flex min-h-56 items-center justify-center overflow-hidden rounded-card bg-surface-secondary p-6 dark:bg-primary">
                <div
                  aria-hidden="true"
                  className="pointer-events-none absolute inset-0 bg-[radial-gradient(70%_60%_at_50%_20%,rgba(244,185,66,0.18),transparent_70%)]"
                />
                <GlowOrb
                  className="top-[-25%] inset-e-[-15%] size-48 bg-accent/20 dark:bg-accent/25"
                  style={{ animationDelay: "-1.5s" }}
                />
                <Countdown
                  target={event.date}
                  variant="auto"
                  className="relative"
                />
              </div>
            </Card>
          </Reveal>
        ) : (
          <Reveal delay={0.1}>
            <EmptyState
              icon={Calendar}
              title={d.nextEvent.emptyTitle}
              description={d.nextEvent.emptyDescription}
              action={
                <Button asChild variant="outline">
                  <Link href="/events">{d.nextEvent.seePast}</Link>
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
