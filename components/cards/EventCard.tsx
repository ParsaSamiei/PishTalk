import Image from "next/image";
import Link from "next/link";
import { Calendar, MapPin } from "lucide-react";

import { Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import type { EventSummary } from "@/features/events/types/event";
import { formatEventDate } from "@/utils/formatDate";

interface EventCardProps {
  readonly event: EventSummary;
}

/**
 * Card used for the "Previous Events" homepage section and the /events archive.
 */
function EventCard({ event }: EventCardProps) {
  const isUpcoming =
    event.date.getTime() >= new Date(new Date().toDateString()).getTime();

  return (
    <Card
      asChild
      className="group overflow-hidden p-0 transition-all duration-300 hover:-translate-y-1.5 hover:border-accent/40 hover:shadow-[0_16px_40px_-24px_rgba(244,185,66,0.55)]"
    >
      <Link href={`/events/${event.slug}`} className="flex h-full flex-col">
        <div className="h-1 w-full scale-x-0 bg-linear-to-l from-accent to-sky-400 transition-transform duration-300 group-hover:scale-x-100" />
        <div className="relative aspect-video w-full overflow-hidden bg-surface-secondary">
          {event.coverImage ? (
            <Image
              src={event.coverImage}
              alt={event.title}
              fill
              className="object-cover transition-transform duration-300 group-hover:scale-105"
              sizes="(min-width: 1024px) 33vw, 100vw"
            />
          ) : (
            <div className="flex size-full items-center justify-center text-text-light">
              <Calendar className="size-10" aria-hidden="true" />
            </div>
          )}
          {isUpcoming ? (
            <Badge variant="accent" className="absolute top-4 inset-e-4">
              رویداد پیش رو
            </Badge>
          ) : (
            <Badge
              variant="neutral"
              className="absolute top-4 inset-e-4 border-white/10 bg-black/50 text-white backdrop-blur-sm"
            >
              برگزار شده
            </Badge>
          )}
        </div>
        <div className="flex flex-1 flex-col gap-3 p-6">
          <h3 className="text-lg font-semibold text-text-primary transition-colors duration-300 group-hover:text-accent">
            {event.title}
          </h3>
          {event.subtitle ? (
            <p className="line-clamp-2 text-sm text-text-secondary">
              {event.subtitle}
            </p>
          ) : null}
          <div className="mt-auto flex flex-col gap-2 pt-2 text-sm text-text-secondary">
            <span className="flex items-center gap-2">
              <Calendar
                className="size-4 text-accent-hover"
                aria-hidden="true"
              />
              {formatEventDate(event.date)}
            </span>
            <span className="flex items-center gap-2">
              <MapPin className="size-4 text-accent-hover" aria-hidden="true" />
              {event.location}
            </span>
          </div>
        </div>
      </Link>
    </Card>
  );
}

export { EventCard };
