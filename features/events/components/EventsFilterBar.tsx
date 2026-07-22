"use client";

import * as React from "react";
import { useRouter, useSearchParams, usePathname } from "next/navigation";
import { Search } from "lucide-react";

import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";
import { cn } from "@/lib/utils";

const TABS = [
  { value: "upcoming", label: "پیش رو" },
  { value: "past", label: "گذشته" },
] as const;

/**
 * Drives the /events listing via URL search params (?filter=upcoming|past&q=...)
 * so the results list stays a Server Component and the filter state is
 * shareable/bookmarkable.
 */
function EventsFilterBar() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const activeFilter = searchParams.get("filter") === "past" ? "past" : "upcoming";
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
      <div className="flex gap-2 rounded-[var(--radius-button)] bg-surface-secondary p-1">
        {TABS.map((tab) => (
          <button
            key={tab.value}
            type="button"
            onClick={() => updateParams({ filter: tab.value })}
            className={cn(
              "rounded-[var(--radius-button)] px-4 py-2 text-sm font-medium transition-colors duration-150",
              activeFilter === tab.value
                ? "bg-surface text-text-primary shadow-sm"
                : "text-text-secondary hover:text-text-primary"
            )}
            aria-pressed={activeFilter === tab.value}
          >
            {tab.label}
          </button>
        ))}
      </div>

      <form onSubmit={handleSearchSubmit} className="flex w-full max-w-sm gap-2">
        <Input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="جستجوی رویداد..."
          aria-label="جستجوی رویداد"
        />
        <Button type="submit" variant="outline" size="icon" aria-label="جستجو">
          <Search className="size-4" aria-hidden="true" />
        </Button>
      </form>
    </div>
  );
}

export { EventsFilterBar };
