import type { LucideIcon } from "lucide-react";
import { Inbox } from "lucide-react";

import { cn } from "@/lib/utils";

interface EmptyStateProps {
  readonly icon?: LucideIcon;
  readonly title: string;
  readonly description?: string;
  readonly action?: React.ReactNode;
  readonly className?: string;
}

/**
 * Reassuring empty state used across every collection (events, blog,
 * gallery, resources, FAQ). Per docs/09_DEVELOPMENT_GUIDELINES.md, empty
 * states should reassure the user nothing is broken and suggest a next step.
 */
function EmptyState({ icon: Icon = Inbox, title, description, action, className }: EmptyStateProps) {
  return (
    <div
      className={cn(
        "flex flex-col items-center gap-3 rounded-[var(--radius-card)] border border-dashed border-border bg-surface-secondary/60 px-6 py-16 text-center",
        className
      )}
    >
      <div className="flex size-14 items-center justify-center rounded-full bg-surface text-accent-hover">
        <Icon className="size-6" aria-hidden="true" />
      </div>
      <h3 className="text-lg font-semibold text-text-primary">{title}</h3>
      {description ? (
        <p className="max-w-sm text-sm text-text-secondary">{description}</p>
      ) : null}
      {action}
    </div>
  );
}

export { EmptyState };
