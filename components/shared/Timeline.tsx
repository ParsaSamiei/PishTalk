import type { EventTimelineItem } from "@/features/events/types/event";
import { cn } from "@/lib/utils";

interface TimelineProps {
  readonly items: readonly EventTimelineItem[];
  readonly className?: string;
}

/**
 * Vertical connected timeline, per docs/04_DESIGN_SYSTEM.md.
 * Used on the homepage Event Timeline section and the event detail page.
 */
function Timeline({ items, className }: TimelineProps) {
  return (
    <ol className={cn("relative flex flex-col gap-8 ps-8", className)}>
      <div
        aria-hidden="true"
        className="absolute top-2 bottom-2 start-[7px] w-px bg-border"
      />
      {items.map((item) => (
        <li key={item.id} className="relative">
          <span aria-hidden="true" className="absolute -start-8 top-1 size-4">
            <span className="absolute -inset-1 rounded-full bg-accent/40 animate-ping" />
            <span className="relative block size-4 rounded-full border-2 border-accent bg-surface" />
          </span>
          <div className="flex flex-col gap-1">
            <span className="text-sm font-semibold text-accent-hover">{item.time}</span>
            <h4 className="text-base font-semibold text-text-primary">{item.title}</h4>
            {item.description ? (
              <p className="text-sm text-text-secondary">{item.description}</p>
            ) : null}
          </div>
        </li>
      ))}
    </ol>
  );
}

export { Timeline };
