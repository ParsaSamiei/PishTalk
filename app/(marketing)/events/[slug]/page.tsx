import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { Calendar, Clock, MapPin, Images, BookOpen } from "lucide-react";

import { Container } from "@/components/layout/Container";
import { Section } from "@/components/layout/Section";
import { Timeline } from "@/components/shared/Timeline";
import { Breadcrumbs } from "@/components/shared/Breadcrumbs";
import { ShareButton } from "@/components/shared/ShareButton";
import { ResourceCard } from "@/components/cards/ResourceCard";
import { Card, CardHeader, CardTitle } from "@/components/ui/Card";
import { RegistrationForm } from "@/features/registration/components/RegistrationForm";
import { getEventBySlug } from "@/features/events/actions/getEvents";
import { prisma } from "@/lib/prisma";
import { formatEventDate, formatWeekday } from "@/utils/formatDate";
import { SITE_URL } from "@/lib/constants";

interface EventPageProps {
  readonly params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: EventPageProps): Promise<Metadata> {
  const { slug } = await params;
  const event = await getEventBySlug(slug);

  if (!event) return { title: "رویداد یافت نشد" };

  const description = event.subtitle ?? event.description.slice(0, 155);

  return {
    title: event.title,
    description,
    alternates: { canonical: `${SITE_URL}/events/${event.slug}` },
    openGraph: event.coverImage
      ? { images: [{ url: event.coverImage }], title: event.title, description }
      : { title: event.title, description },
  };
}

async function getEventExtras(eventId: string) {
  try {
    const [resources, gallery] = await Promise.all([
      prisma.resource.findMany({ where: { eventId, deletedAt: null }, orderBy: { title: "asc" } }),
      prisma.gallery.findUnique({
        where: { eventId },
        include: { media: { where: { type: "IMAGE" }, orderBy: { sortOrder: "asc" }, take: 8 } },
      }),
    ]);
    return { resources, galleryImages: gallery?.media ?? [] };
  } catch {
    return { resources: [], galleryImages: [] };
  }
}

export default async function EventPage({ params }: EventPageProps) {
  const { slug } = await params;
  const event = await getEventBySlug(slug);

  if (!event || event.status === "DRAFT") {
    notFound();
  }

  const { resources, galleryImages } = await getEventExtras(event.id);
  const isPast = event.date.getTime() < new Date(new Date().toDateString()).getTime();
  const eventUrl = `${SITE_URL}/events/${event.slug}`;

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Event",
    name: event.title,
    description: event.description,
    startDate: event.date.toISOString(),
    eventAttendanceMode: "https://schema.org/OfflineEventAttendanceMode",
    eventStatus: isPast
      ? "https://schema.org/EventScheduled"
      : "https://schema.org/EventScheduled",
    location: { "@type": "Place", name: event.location },
    image: event.coverImage ? [event.coverImage] : undefined,
    performer: event.speakerName ? { "@type": "Person", name: event.speakerName } : undefined,
    organizer: { "@type": "Organization", name: "پیشتاک", url: SITE_URL },
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <section className="relative bg-primary text-white">
        {event.coverImage ? (
          <div className="absolute inset-0">
            <Image
              src={event.coverImage}
              alt=""
              fill
              className="object-cover opacity-25"
              priority
            />
          </div>
        ) : null}
        <Container className="relative flex flex-col gap-6 py-20">
          <Breadcrumbs
            variant="light"
            items={[{ label: "رویدادها", href: "/events" }, { label: event.title }]}
          />
          <h1 className="max-w-3xl text-3xl font-bold sm:text-5xl">{event.title}</h1>
          {event.subtitle ? <p className="max-w-2xl text-lg text-white/80">{event.subtitle}</p> : null}
          <div className="flex flex-col gap-3 text-sm text-white/80 sm:flex-row sm:gap-8">
            <span className="flex items-center gap-2">
              <Calendar className="size-4 text-accent" aria-hidden="true" />
              {formatWeekday(event.date)}، {formatEventDate(event.date)}
            </span>
            <span className="flex items-center gap-2">
              <Clock className="size-4 text-accent" aria-hidden="true" />
              {event.startTime}
              {event.endTime ? ` تا ${event.endTime}` : ""}
            </span>
            <span className="flex items-center gap-2">
              <MapPin className="size-4 text-accent" aria-hidden="true" />
              {event.location}
            </span>
          </div>
        </Container>
      </section>

      <Section>
        <Container className="grid gap-12 lg:grid-cols-[1fr_1.3fr]">
          {/* Registration comes right after the Hero per docs/03_Information_Architecture.md */}
          <div id="register" className="scroll-mt-24 lg:order-1">
            <Card className="p-8">
              <h2 className="mb-6 text-xl font-bold text-text-primary">
                {isPast ? "ثبت‌نام این رویداد بسته شده است" : "ثبت‌نام در رویداد"}
              </h2>
              {isPast ? (
                <p className="text-text-secondary">
                  این رویداد برگزار شده است. رویداد بعدی را در صفحه رویدادها دنبال کنید.
                </p>
              ) : (
                <RegistrationForm eventId={event.id} />
              )}
            </Card>
          </div>

          <div className="flex flex-col gap-12 lg:order-2">
            <div className="flex flex-col gap-4">
              <h2 className="text-2xl font-bold text-text-primary">درباره این رویداد</h2>
              <p className="whitespace-pre-line leading-relaxed text-text-secondary">
                {event.description}
              </p>
            </div>

            {event.speakerName ? (
              <Card>
                <CardHeader>
                  <span className="text-sm font-semibold text-accent-hover">سخنران</span>
                  <CardTitle>{event.speakerName}</CardTitle>
                </CardHeader>
                {event.speakerBio ? (
                  <p className="text-text-secondary leading-relaxed">{event.speakerBio}</p>
                ) : null}
              </Card>
            ) : null}

            {event.timeline.length > 0 ? (
              <div className="flex flex-col gap-6">
                <h2 className="text-2xl font-bold text-text-primary">برنامه زمانی</h2>
                <Timeline items={event.timeline} />
              </div>
            ) : null}

            {resources.length > 0 ? (
              <div className="flex flex-col gap-6">
                <h2 className="flex items-center gap-2 text-2xl font-bold text-text-primary">
                  <BookOpen className="size-6 text-accent-hover" aria-hidden="true" />
                  منابع این رویداد
                </h2>
                <div className="grid gap-6 sm:grid-cols-2">
                  {resources.map((resource) => (
                    <ResourceCard
                      key={resource.id}
                      resource={{
                        id: resource.id,
                        title: resource.title,
                        description: resource.description,
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
                  <Images className="size-6 text-accent-hover" aria-hidden="true" />
                  گالری این رویداد
                </h2>
                <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
                  {galleryImages.map((image) => (
                    <div
                      key={image.id}
                      className="relative aspect-square overflow-hidden rounded-[var(--radius-card)] bg-surface-secondary"
                    >
                      <Image
                        src={image.url}
                        alt={image.caption ?? event.title}
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
                  مشاهده گالری کامل
                </Link>
              </div>
            ) : null}

            <div>
              <ShareButton title={event.title} url={eventUrl} />
            </div>
          </div>
        </Container>
      </Section>
    </>
  );
}
