import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { CheckCircle2, Clock3, Calendar, MapPin, XCircle } from "lucide-react";

import { Container } from "@/components/layout/Container";
import { Section } from "@/components/layout/Section";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { prisma } from "@/lib/prisma";
import { getLocaleContext } from "@/lib/i18n/server";
import { pick } from "@/lib/i18n/content";
import { formatEventDate, formatWeekday } from "@/utils/formatDate";
import { resolveCertificateName } from "@/features/registration/types/registration";

interface RegistrationStatusPageProps {
  readonly params: Promise<{ token: string }>;
}

/**
 * Looks a registration up by its opaque approvalToken rather than its id:
 * the id is sequential-ish and shows up in admin URLs/exports, so it isn't
 * safe to also use as a bearer credential for this public, unauthenticated
 * page. See prisma/schema.prisma's comment on Registration.approvalToken.
 */
async function getRegistrationByToken(token: string) {
  return prisma.registration.findUnique({
    where: { approvalToken: token },
    include: { event: true },
  });
}

export async function generateMetadata({
  params,
}: RegistrationStatusPageProps): Promise<Metadata> {
  const { token } = await params;
  const { dictionary: d } = await getLocaleContext();
  const registration = await getRegistrationByToken(token);

  return {
    title: registration ? d.registration.approvalPageTitle : d.notFound.metaTitle,
    // This page is only ever reached via a private SMS link — nothing
    // about it should show up in search results.
    robots: { index: false, follow: false },
  };
}

export default async function RegistrationStatusPage({
  params,
}: RegistrationStatusPageProps) {
  const { token } = await params;
  const { locale, dictionary: d } = await getLocaleContext();
  const registration = await getRegistrationByToken(token);

  if (!registration) {
    notFound();
  }

  const { event } = registration;

  if (registration.status !== "APPROVED") {
    return (
      <Section className="flex min-h-[70vh] items-center" circuit>
        <Container className="mx-auto flex max-w-md flex-col items-center gap-4 text-center">
          <XCircle className="size-16 text-text-secondary" aria-hidden="true" />
          <h1 className="text-2xl font-bold text-text-primary">
            {d.registration.approvalNotApprovedTitle}
          </h1>
          <p className="text-text-secondary">{d.registration.approvalNotApprovedBody}</p>
          <Button asChild className="mt-2">
            <Link href="/">{d.common.backHome}</Link>
          </Button>
        </Container>
      </Section>
    );
  }

  const title = pick(locale, event.title, event.titleEn);
  const location = pick(locale, event.location, event.locationEn);

  return (
    <Section className="flex min-h-[70vh] items-center" circuit>
      <Container className="mx-auto flex max-w-lg flex-col items-center gap-6 text-center">
        <CheckCircle2 className="size-16 text-success" aria-hidden="true" />
        <div className="flex flex-col gap-2">
          <h1 className="text-2xl font-bold text-text-primary">
            {d.registration.approvalHeading}
          </h1>
          <p className="text-text-secondary">{d.registration.approvalBody}</p>
        </div>

        <Card className="w-full p-6 text-start">
          <h2 className="mb-4 text-lg font-semibold text-text-primary">{title}</h2>
          <dl className="flex flex-col gap-3 text-sm">
            <div className="flex items-center gap-3">
              <Calendar className="size-4 shrink-0 text-accent" aria-hidden="true" />
              <span className="text-text-secondary">{d.registration.approvalDate}:</span>
              <span className="font-medium text-text-primary">
                {formatWeekday(event.date, locale)} {formatEventDate(event.date, locale)}
              </span>
            </div>
            <div className="flex items-center gap-3">
              <Clock3 className="size-4 shrink-0 text-accent" aria-hidden="true" />
              <span className="text-text-secondary">{d.registration.approvalTime}:</span>
              <span className="font-medium text-text-primary" dir="ltr">
                {event.startTime}
                {event.endTime ? ` – ${event.endTime}` : ""}
              </span>
            </div>
            <div className="flex items-center gap-3">
              <MapPin className="size-4 shrink-0 text-accent" aria-hidden="true" />
              <span className="text-text-secondary">{d.registration.approvalLocation}:</span>
              <span className="font-medium text-text-primary">{location}</span>
            </div>
            <div className="flex items-center gap-3">
              <CheckCircle2 className="size-4 shrink-0 text-accent" aria-hidden="true" />
              <span className="text-text-secondary">
                {d.registration.approvalAttendeeName}:
              </span>
              <span className="font-medium text-text-primary">
                {resolveCertificateName(registration)}
              </span>
            </div>
          </dl>
        </Card>

        <div className="mt-2 flex flex-wrap justify-center gap-3">
          <Button asChild>
            <Link href={`/events/${event.slug}`}>{title}</Link>
          </Button>
          <Button asChild variant="outline">
            <Link href="/my-registrations">{d.registration.viewMyRegistrations}</Link>
          </Button>
        </div>
      </Container>
    </Section>
  );
}
