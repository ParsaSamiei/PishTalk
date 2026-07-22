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
  const isUpcoming = event.date.getTime() >= new Date(new Date().toDateString()).getTime();

  return (
    <Card asChild className="group overflow-hidden p-0 hover:-translate-y-0.5">
      <Link href={`/events/${event.slug}`} className="flex h-full flex-col">
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
            <Badge variant="accent" className="absolute top-4 end-4">
              رویداد پیش رو
            </Badge>
          ) : null}
        </div>
        <div className="flex flex-1 flex-col gap-3 p-6">
          <h3 className="text-lg font-semibold text-text-primary">{event.title}</h3>
          {event.subtitle ? (
            <p className="line-clamp-2 text-sm text-text-secondary">{event.subtitle}</p>
          ) : null}
          <div className="mt-auto flex flex-col gap-2 pt-2 text-sm text-text-secondary">
            <span className="flex items-center gap-2">
              <Calendar className="size-4 text-accent-hover" aria-hidden="true" />
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
