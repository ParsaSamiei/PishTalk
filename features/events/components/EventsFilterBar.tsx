"use client";

import * as React from "react";
import { useRouter, useSearchParams, usePathname } from "next/navigation";
import { motion } from "framer-motion";
import { Search } from "lucide-react";

import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";
import { useDictionary } from "@/lib/i18n/client";
import { cn } from "@/lib/utils";

const TAB_VALUES = ["upcoming", "past"] as const;

/**
 * Drives the /events listing via URL search params (?filter=upcoming|past&q=...)
 * so the results list stays a Server Component and the filter state is
 * shareable/bookmarkable.
 */
function EventsFilterBar() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const d = useDictionary();

  const tabs = [
    { value: TAB_VALUES[0], label: d.events.filterUpcoming },
    { value: TAB_VALUES[1], label: d.events.filterPast },
  ];

  const activeFilter =
    searchParams.get("filter") === "past" ? "past" : "upcoming";
  const [query, setQuery] = React.useState(searchParams.get("q") ?? "");

  function updateParams(next: { filter?: string; q?: string }) {
    const params = new URLSearchParams(searchParams.toString());
    if (next.filter !== undefined) params.set("filter", next.filter);
    if (next.q !== undefined) {
      if (next.q) params.set("q", next.q);
      else params.delete("q");
    }
    router.push(`${pathname}?${params.toString()}`);
  }

  function handleSearchSubmit(event: React.FormEvent) {
    event.preventDefault();
    updateParams({ q: query });
  }

  return (
    <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
      <div className="relative flex gap-1 rounded-button border border-border bg-surface-secondary p-1">
        {tabs.map((tab) => {
          const isActive = activeFilter === tab.value;
          return (
            <button
              key={tab.value}
              type="button"
              onClick={() => updateParams({ filter: tab.value })}
              className={cn(
                "relative z-10 rounded-button px-4 py-2 text-sm font-medium transition-colors duration-200",
                isActive
                  ? "text-primary dark:text-primary"
                  : "text-text-secondary hover:text-text-primary",
              )}
              aria-pressed={isActive}
            >
              {isActive ? (
                <motion.span
                  layoutId="events-filter-active"
                  transition={{ type: "spring", stiffness: 400, damping: 32 }}
                  className="absolute inset-0 -z-10 rounded-button bg-accent shadow-[0_4px_16px_-4px_rgba(244,185,66,0.5)]"
                />
              ) : null}
              {tab.label}
            </button>
          );
        })}
      </div>

      <form
        onSubmit={handleSearchSubmit}
        className="flex w-full max-w-sm gap-2"
      >
        <Input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder={d.events.searchPlaceholder}
          aria-label={d.events.searchLabel}
        />
        <Button
          type="submit"
          variant="outline"
          size="icon"
          aria-label={d.events.searchSubmit}
        >
          <Search className="size-4" aria-hidden="true" />
        </Button>
      </form>
    </div>
  );
}

export { EventsFilterBar };
