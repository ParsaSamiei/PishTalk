import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { Calendar, Clock, MapPin, Images, BookOpen } from "lucide-react";

import { Container } from "@/components/layout/Container";
import { Section } from "@/components/layout/Section";
import { CircuitBackground } from "@/components/illustrations/CircuitBackground";
import { Timeline } from "@/components/shared/Timeline";
import { Breadcrumbs } from "@/components/shared/Breadcrumbs";
import { ShareButton } from "@/components/shared/ShareButton";
import { ResourceCard } from "@/components/cards/ResourceCard";
import { Card, CardHeader, CardTitle } from "@/components/ui/Card";
import { RegistrationForm } from "@/features/registration/components/RegistrationForm";
import { getEventBySlug } from "@/features/events/actions/getEvents";
import { prisma } from "@/lib/prisma";
import { getLocaleContext } from "@/lib/i18n/server";
import { pick } from "@/lib/i18n/content";
import { formatEventDate, formatWeekday } from "@/utils/formatDate";
import { SITE_URL } from "@/lib/constants";

interface EventPageProps {
  readonly params: Promise<{ slug: string }>;
}

export async function generateMetadata({
  params,
}: EventPageProps): Promise<Metadata> {
  const { slug } = await params;
  const { locale, dictionary: d } = await getLocaleContext();
  const event = await getEventBySlug(slug);

  if (!event) return { title: d.events.notFound };

  const title = pick(locale, event.title, event.titleEn);
  const description =
    pick(locale, event.subtitle, event.subtitleEn) ??
    pick(locale, event.description, event.descriptionEn).slice(0, 155);

  return {
    title,
    description,
    alternates: { canonical: `${SITE_URL}/events/${event.slug}` },
    openGraph: event.coverImage
      ? { images: [{ url: event.coverImage }], title, description }
      : { title, description },
  };
}

async function getEventExtras(eventId: string) {
  try {
    const [resources, gallery] = await Promise.all([
      prisma.resource.findMany({
        where: { eventId, deletedAt: null },
        orderBy: { title: "asc" },
      }),
      prisma.gallery.findUnique({
        where: { eventId },
        include: {
          media: {
            where: { type: "IMAGE" },
            orderBy: { sortOrder: "asc" },
            take: 8,
          },
        },
      }),
    ]);
    return { resources, galleryImages: gallery?.media ?? [] };
  } catch {
    return { resources: [], galleryImages: [] };
  }
}

export default async function EventPage({ params }: EventPageProps) {
  const { slug } = await params;
  const { locale, dictionary: d } = await getLocaleContext();
  const event = await getEventBySlug(slug);

  if (!event || event.status === "DRAFT") {
    notFound();
  }

  const { resources, galleryImages } = await getEventExtras(event.id);
  const isPast =
    event.date.getTime() < new Date(new Date().toDateString()).getTime();
  const eventUrl = `${SITE_URL}/events/${event.slug}`;

  const title = pick(locale, event.title, event.titleEn);
  const subtitle = pick(locale, event.subtitle, event.subtitleEn);
  const description = pick(locale, event.description, event.descriptionEn);
  const location = pick(locale, event.location, event.locationEn);
  const speakerName = pick(locale, event.speakerName, event.speakerNameEn);
  const speakerBio = pick(locale, event.speakerBio, event.speakerBioEn);

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Event",
    name: title,
    description,
    startDate: event.date.toISOString(),
    eventAttendanceMode: "https://schema.org/OfflineEventAttendanceMode",
    eventStatus: isPast
      ? "https://schema.org/EventScheduled"
      : "https://schema.org/EventScheduled",
    location: { "@type": "Place", name: location },
    image: event.coverImage ? [event.coverImage] : undefined,
    performer: speakerName
      ? { "@type": "Person", name: speakerName }
      : undefined,
    // The site name is a brand wordmark rather than a translatable string, so
    // it comes from the logo keys ("پیشتاک" / "Pishtalk") to stay localized.
    organizer: {
      "@type": "Organization",
      name: `${d.logo.first}${d.logo.second}`,
      url: SITE_URL,
    },
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <section className="relative overflow-hidden bg-surface-primary">
        {event.coverImage ? (
          <div className="absolute inset-0">
            <Image
              src={event.coverImage}
              alt=""
              fill
              priority
              className="object-cover"
            />
            <div className="absolute inset-0 bg-surface-primary/75 dark:bg-surface-primary/60 backdrop-blur-[2px]" />
          </div>
        ) : (
          <CircuitBackground
            id="event-hero"
            className="text-primary/4.5 dark:text-white/4.5"
          />
        )}

        <Container className="relative flex flex-col gap-6 py-20">
          <Breadcrumbs
            variant="default"
            items={[
              { label: d.events.pageTitle, href: "/events" },
              { label: title },
            ]}
          />

          <h1 className="max-w-3xl text-3xl font-bold text-text-primary sm:text-5xl">
            {title}
          </h1>

          {subtitle ? (
            <p className="max-w-2xl text-lg text-text-secondary">{subtitle}</p>
          ) : null}

          <div className="flex flex-col gap-3 text-sm text-text-secondary sm:flex-row sm:gap-8">
            <span className="flex items-center gap-2">
              <Calendar className="size-4 text-accent" aria-hidden="true" />
              {formatWeekday(event.date, locale)}
              {locale === "fa" ? "،" : ","}{" "}
              {formatEventDate(event.date, locale)}
            </span>

            <span className="flex items-center gap-2">
              <Clock className="size-4 text-accent" aria-hidden="true" />
              {event.startTime}
              {event.endTime ? ` ${d.events.to} ${event.endTime}` : ""}
            </span>

            <span className="flex items-center gap-2">
              <MapPin className="size-4 text-accent" aria-hidden="true" />
              {location}
            </span>
          </div>
        </Container>
      </section>

      <Section circuit>
        <Container className="grid gap-12 lg:grid-cols-[1fr_1.3fr]">
          {/* Registration comes right after the Hero per docs/03_Information_Architecture.md */}
          <div id="register" className="scroll-mt-24 lg:order-1">
            <Card className="p-8">
              <h2 className="mb-6 text-xl font-bold text-text-primary">
                {isPast ? d.events.registerClosed : d.events.registerOpen}
              </h2>
              {isPast ? (
                <p className="text-text-secondary">{d.events.pastNotice}</p>
              ) : (
                <RegistrationForm eventId={event.id} />
              )}
            </Card>
          </div>

          <div className="flex flex-col gap-12 lg:order-2">
            <div className="flex flex-col gap-4">
              <h2 className="text-2xl font-bold text-text-primary">
                {d.events.aboutEvent}
              </h2>
              <p className="whitespace-pre-line leading-relaxed text-text-secondary">
                {description}
              </p>
            </div>

            {speakerName ? (
              <Card>
                <CardHeader>
                  <span className="text-sm font-semibold text-accent-hover">
                    {d.events.speaker}
                  </span>
                  <CardTitle>{speakerName}</CardTitle>
                </CardHeader>
                {speakerBio ? (
                  <p className="text-text-secondary leading-relaxed">
                    {speakerBio}
                  </p>
                ) : null}
              </Card>
            ) : null}

            {event.timeline.length > 0 ? (
              <div className="flex flex-col gap-6">
                <h2 className="text-2xl font-bold text-text-primary">
                  {d.events.schedule}
                </h2>
                <Timeline items={event.timeline} />
              </div>
            ) : null}

            {resources.length > 0 ? (
              <div className="flex flex-col gap-6">
                <h2 className="flex items-center gap-2 text-2xl font-bold text-text-primary">
                  <BookOpen
                    className="size-6 text-accent-hover"
                    aria-hidden="true"
                  />
                  {d.events.eventResources}
                </h2>
                <div className="grid gap-6 sm:grid-cols-2">
                  {resources.map((resource) => (
                    <ResourceCard
                      key={resource.id}
                      resource={{
                        id: resource.id,
                        title: resource.title,
                        titleEn: resource.titleEn,
                        description: resource.description,
                        descriptionEn: resource.descriptionEn,
                        resourceType: resource.resourceType,
                        fileUrl: resource.fileUrl,
                        externalUrl: resource.externalUrl,
                      }}
                    />
                  ))}
                </div>
              </div>
            ) : null}

            {galleryImages.length > 0 ? (
              <div className="flex flex-col gap-6">
                <h2 className="flex items-center gap-2 text-2xl font-bold text-text-primary">
                  <Images
                    className="size-6 text-accent-hover"
                    aria-hidden="true"
                  />
                  {d.events.eventGallery}
                </h2>
                <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
                  {galleryImages.map((image) => (
                    <div
                      key={image.id}
                      className="relative aspect-square overflow-hidden rounded-card bg-surface-secondary"
                    >
                      <Image
                        src={image.url}
                        alt={pick(locale, image.caption, image.captionEn) ?? title}
                        fill
                        className="object-cover"
                        loading="lazy"
                      />
                    </div>
                  ))}
                </div>
                <Link
                  href="/gallery"
                  className="self-start text-sm font-medium text-accent-hover hover:underline"
                >
                  {d.events.viewFullGallery}
                </Link>
              </div>
            ) : null}

            <div>
              <ShareButton title={title} url={eventUrl} />
            </div>
          </div>
        </Container>
      </Section>
    </>
  );
}
