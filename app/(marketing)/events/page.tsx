import type { Metadata } from "next";
import { Suspense } from "react";
import { CalendarDays } from "lucide-react";

import { Container } from "@/components/layout/Container";
import { Section } from "@/components/layout/Section";
import { EmptyState } from "@/components/shared/EmptyState";
import { EventCard } from "@/components/cards/EventCard";
import { EventsFilterBar } from "@/features/events/components/EventsFilterBar";
import { getUpcomingEvents, getPastEvents } from "@/features/events/actions/getEvents";
import { SITE_URL } from "@/lib/constants";

export const metadata: Metadata = {
  title: "رویدادها",
  description: "تمام رویدادهای پیشتاک، پیش رو و گذشته، در یک صفحه.",
  alternates: { canonical: `${SITE_URL}/events` },
};

interface EventsPageProps {
  readonly searchParams: Promise<{ filter?: string; q?: string }>;
}

export default async function EventsPage({ searchParams }: EventsPageProps) {
  const { filter, q } = await searchParams;
  const isPast = filter === "past";

  const events = isPast
    ? await getPastEvents(100, q)
    : await getUpcomingEvents(100, q);

  return (
    <Section className="pt-12">
      <Container className="flex flex-col gap-10">
        <div className="flex flex-col gap-3">
          <h1 className="text-3xl font-bold text-text-primary sm:text-4xl">رویدادها</h1>
          <p className="max-w-2xl text-lg text-text-secondary">
            رویداد پیش رو را از دست ندهید و آرشیو رویدادهای گذشته پیشتاک را مرور کنید.
          </p>
        </div>

        <Suspense>
          <EventsFilterBar />
        </Suspense>

        {events.length > 0 ? (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {events.map((event) => (
              <EventCard key={event.id} event={event} />
            ))}
          </div>
        ) : (
          <EmptyState
            icon={CalendarDays}
            title={
              q
                ? "رویدادی با این مشخصات پیدا نشد"
                : isPast
                  ? "هنوز رویداد گذشته‌ای ثبت نشده است"
                  : "رویداد پیش رویی ثبت نشده است"
            }
            description={
              q
                ? "عبارت دیگری را امتحان کنید یا فیلتر را تغییر دهید."
                : "رویدادهای پیشتاک به‌محض قطعی شدن اینجا اعلام می‌شوند."
            }
          />
        )}
      </Container>
    </Section>
  );
}
