import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import {
  CheckCircle2,
  Clock3,
  Calendar,
  MapPin,
  User,
  XCircle,
  type LucideIcon,
} from "lucide-react";

import { Container } from "@/components/layout/Container";
import { Section } from "@/components/layout/Section";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { prisma } from "@/lib/prisma";
import { getLocaleContext } from "@/lib/i18n/server";
import { pick } from "@/lib/i18n/content";
import { getSiteSettings } from "@/lib/site-settings";
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
    title: registration
      ? d.registration.approvalPageTitle
      : d.notFound.metaTitle,
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
          <p className="text-text-secondary">
            {d.registration.approvalNotApprovedBody}
          </p>
          <Button asChild className="mt-2">
            <Link href="/">{d.common.backHome}</Link>
          </Button>
        </Container>
      </Section>
    );
  }

  const settings = await getSiteSettings();
  const title = pick(locale, event.title, event.titleEn);
  const location = pick(locale, event.location, event.locationEn);
  const address = pick(locale, settings.address, settings.addressEn);
  const attendeeName = resolveCertificateName(registration);
  // Used only when the admin hasn't pasted a maps embed yet, so the panel
  // still gives the attendee a way to find the venue.
  const mapsSearchQuery = location ?? address;
  const mapsSearchUrl = mapsSearchQuery
    ? `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(mapsSearchQuery)}`
    : null;

  return (
    <Section className="flex min-h-[70vh] items-center py-16" circuit>
      <Container className="mx-auto flex max-w-2xl flex-col items-center gap-6 text-center">
        <span className="flex size-24 items-center justify-center rounded-full bg-success/10 ring-8 ring-success/5">
          <CheckCircle2 className="size-12 text-success" aria-hidden="true" />
        </span>
        <div className="flex flex-col gap-2">
          <h1 className="text-2xl font-bold text-text-primary sm:text-3xl">
            {d.registration.approvalHeading}
          </h1>
          <p className="text-text-secondary">{d.registration.approvalBody}</p>
        </div>

        {attendeeName ? (
          <div className="rounded-input border-2 border-accent/60 bg-accent/5 px-8 py-3">
            <span className="flex items-center justify-center gap-2 text-base font-semibold text-text-primary sm:text-lg">
              <User
                className="size-4 shrink-0 text-accent-hover"
                aria-hidden="true"
              />
              {attendeeName}
            </span>
          </div>
        ) : null}

        <OrnamentDivider />

        <Card className="w-full overflow-hidden rounded-dialog border-2 border-accent/30 p-0 text-start shadow-lg">
          <div className="border-b border-accent/20 bg-accent/5 px-6 py-5 sm:px-8">
            <h2 className="text-lg font-bold text-text-primary sm:text-xl">
              {title}
            </h2>
            <span
              className="mt-2 block h-1 w-14 rounded-full bg-accent"
              aria-hidden="true"
            />
          </div>

          {/*
           * Mirrors the printed invitation card: event details on one side,
           * a location panel on the other. DOM order is map-panel first so
           * it lands on the visual right in this always-RTL layout, matching
           * the invitation's QR/location box placement.
           */}
          <div className="grid sm:grid-cols-2 sm:divide-x sm:divide-x-reverse sm:divide-accent/20">
            <div className="flex flex-col gap-3 border-b border-accent/20 bg-accent/3 p-6 sm:border-b-0 sm:p-8">
              <MapPanel
                title={d.registration.approvalMapTitle}
                caption={d.registration.approvalMapCaption}
                fallbackCta={d.registration.approvalMapFallbackCta}
                embedHtml={settings.googleMapsEmbed}
                address={address}
                mapsSearchUrl={mapsSearchUrl}
              />
            </div>

            <dl className="flex flex-col gap-5 p-6 text-sm sm:p-8">
              <InfoRow
                icon={Calendar}
                label={d.registration.approvalDate}
                value={`${formatWeekday(event.date, locale)} ${formatEventDate(event.date, locale)}`}
              />
              <InfoRow
                icon={Clock3}
                label={d.registration.approvalTime}
                value={`${event.startTime}${event.endTime ? ` – ${event.endTime}` : ""}`}
                dir="ltr"
              />
              <InfoRow
                icon={MapPin}
                label={d.registration.approvalLocation}
                value={location}
              />
            </dl>
          </div>
        </Card>

        <div className="mt-2 flex flex-wrap justify-center gap-3">
          <Button asChild>
            <Link href={`/events/${event.slug}`}>{title}</Link>
          </Button>
          <Button asChild variant="outline">
            <Link href="/my-registrations">
              {d.registration.viewMyRegistrations}
            </Link>
          </Button>
        </div>
      </Container>
    </Section>
  );
}

/** A thin line–diamond–line rule, the same ornamental divider used between
 * sections on the printed invitation. */
function OrnamentDivider() {
  return (
    <div className="flex w-full max-w-55 items-center gap-3" aria-hidden="true">
      <span className="h-px flex-1 bg-accent/40" />
      <span className="size-2 rotate-45 bg-accent" />
      <span className="h-px flex-1 bg-accent/40" />
    </div>
  );
}

interface InfoRowProps {
  readonly icon: LucideIcon;
  readonly label: string;
  readonly value: string;
  readonly dir?: "ltr" | "rtl";
}

/** A dark, gold-icon badge next to a label/value pair — the same icon-box
 * treatment as the printed invitation's date/time/location rows. */
function InfoRow({ icon: Icon, label, value, dir }: InfoRowProps) {
  return (
    <div className="flex items-start gap-4">
      <span
        aria-hidden="true"
        className="flex size-12 shrink-0 items-center justify-center rounded-2xl bg-primary text-accent shadow-sm ring-1 ring-accent/20"
      >
        <Icon className="size-5" />
      </span>
      <div className="flex min-w-0 flex-col gap-0.5 pt-0.5">
        <span className="text-xs text-text-secondary">{label}</span>
        <span className="text-base font-semibold text-text-primary" dir={dir}>
          {value}
        </span>
      </div>
    </div>
  );
}

interface MapPanelProps {
  readonly title: string;
  readonly caption: string;
  readonly fallbackCta: string;
  readonly embedHtml: string | null;
  readonly address: string | null;
  readonly mapsSearchUrl: string | null;
}

/**
 * Stands in for the invitation's QR code: instead of a scannable code, the
 * attendee gets the same Google Maps embed configured in the admin's site
 * settings (and shown on /contact), so the venue is one glance away.
 */
function MapPanel({
  title,
  caption,
  fallbackCta,
  embedHtml,
  address,
  mapsSearchUrl,
}: MapPanelProps) {
  return (
    <div className="flex flex-col items-center gap-3 text-center">
      <div className="w-full overflow-hidden rounded-2xl border-2 border-accent/40 bg-surface shadow-sm">
        <div className="flex items-center justify-center gap-2 bg-primary px-4 py-3 text-sm font-bold tracking-wide text-accent">
          <MapPin className="size-4 shrink-0" aria-hidden="true" />
          {title}
        </div>
        {embedHtml ? (
          <div
            className="[&_iframe]:h-full [&_iframe]:w-full [&_iframe]:border-0"
            style={{ aspectRatio: "4 / 3" }}
            dangerouslySetInnerHTML={{ __html: embedHtml }}
          />
        ) : (
          <div
            className="flex flex-col items-center justify-center gap-3 bg-surface-secondary/30 p-6"
            style={{ aspectRatio: "4 / 3" }}
          >
            <MapPin className="size-8 text-accent" aria-hidden="true" />
            {address ? (
              <p className="text-sm text-text-secondary">{address}</p>
            ) : null}
            {mapsSearchUrl ? (
              <Button asChild size="sm" variant="outline">
                <a href={mapsSearchUrl} target="_blank" rel="noreferrer">
                  {fallbackCta}
                </a>
              </Button>
            ) : null}
          </div>
        )}
      </div>
      <p className="text-xs text-text-secondary">{caption}</p>
    </div>
  );
}
