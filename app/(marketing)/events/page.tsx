import type { Metadata } from "next";
import { Suspense } from "react";
import { CalendarDays } from "lucide-react";

import { Container } from "@/components/layout/Container";
import { Section } from "@/components/layout/Section";
import { EmptyState } from "@/components/shared/EmptyState";
import { EventCard } from "@/components/cards/EventCard";
import { EventsFilterBar } from "@/features/events/components/EventsFilterBar";
import { GlowOrb } from "@/components/illustrations/GlowOrb";
import {
  getUpcomingEvents,
  getPastEvents,
} from "@/features/events/actions/getEvents";
import { getDictionary } from "@/lib/i18n/server";
import { SITE_URL } from "@/lib/constants";

// Prevents this page from being statically prerendered at Docker build time (when the DB may be empty/unreachable) and cached forever.
export const dynamic = "force-dynamic";

export async function generateMetadata(): Promise<Metadata> {
  const d = await getDictionary();

  return {
    title: d.events.pageTitle,
    description: d.events.metaDescription,
    alternates: { canonical: `${SITE_URL}/events` },
  };
}

interface EventsPageProps {
  readonly searchParams: Promise<{ filter?: string; q?: string }>;
}

export default async function EventsPage({ searchParams }: EventsPageProps) {
  const { filter, q } = await searchParams;
  const isPast = filter === "past";
  const d = await getDictionary();

  const events = isPast
    ? await getPastEvents(100, q)
    : await getUpcomingEvents(100, q);

  return (
    <Section className="relative overflow-hidden pt-12" circuit>
      <GlowOrb
        className="top-[-10%] inset-e-[-8%] size-72 bg-accent/35 dark:bg-accent/20"
        style={{ animationDelay: "-2s" }}
      />
      <Container className="relative flex flex-col gap-10">
        <div className="flex flex-col gap-3">
          <h1 className="text-3xl font-bold text-text-primary sm:text-4xl">
            {d.events.pageTitle}
          </h1>
          <p className="max-w-2xl text-lg text-text-secondary">
            {d.events.lead}
          </p>
        </div>

        <Suspense>
          <EventsFilterBar />
        </Suspense>

        {events.length > 0 ? (
          isPast ? (
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {events.map((event) => (
                <EventCard key={event.id} event={event} />
              ))}
            </div>
          ) : (
            <div className="mx-auto w-full max-w-2xl">
              {events.map((event) => (
                <EventCard key={event.id} event={event} />
              ))}
            </div>
          )
        ) : (
          <EmptyState
            icon={CalendarDays}
            title={
              q
                ? d.events.notFoundSearch
                : isPast
                  ? d.events.emptyPast
                  : d.events.emptyUpcoming
            }
            description={q ? d.events.searchHint : d.events.announceHint}
          />
        )}
      </Container>
    </Section>
  );
}
