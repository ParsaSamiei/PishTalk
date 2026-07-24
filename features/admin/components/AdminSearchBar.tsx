"use client";

import * as React from "react";
import { useRouter, usePathname, useSearchParams } from "next/navigation";
import { Search } from "lucide-react";

import { Input } from "@/components/ui/Input";
import { cn } from "@/lib/utils";

export interface AdminFilterOption {
  readonly value: string;
  readonly label: string;
}

interface AdminSearchBarProps {
  readonly searchPlaceholder?: string;
  readonly filterOptions?: readonly AdminFilterOption[];
  readonly filterParam?: string;
}

/**
 * Reusable search + status-filter bar for admin list pages (Events,
 * Registrations, Blog, ...), per docs/07_ADMIN_PANEL.md's per-section
 * "Filters" and "Search" requirements. Drives the URL so the list itself
 * stays a Server Component; resets to page 1 on any change.
 */
function AdminSearchBar({
  searchPlaceholder = "جستجو...",
  filterOptions,
  filterParam = "status",
}: AdminSearchBarProps) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const [query, setQuery] = React.useState(searchParams.get("q") ?? "");
  const activeFilter = searchParams.get(filterParam) ?? "all";

  function updateParams(next: Record<string, string>) {
    const params = new URLSearchParams(searchParams.toString());
    for (const [key, value] of Object.entries(next)) {
      if (value && value !== "all") params.set(key, value);
      else params.delete(key);
    }
    params.delete("page");
    router.push(`${pathname}?${params.toString()}`);
  }

  function handleSubmit(event: React.FormEvent) {
    event.preventDefault();
    updateParams({ q: query });
  }

  return (
    <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
      <form onSubmit={handleSubmit} className="w-full max-w-sm">
        <div className="relative">
          <Search
            className="pointer-events-none absolute top-1/2 start-3 size-4 -translate-y-1/2 text-text-light"
            aria-hidden="true"
          />
          <Input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder={searchPlaceholder}
            aria-label={searchPlaceholder}
            className="ps-9"
          />
        </div>
      </form>

      {filterOptions ? (
        <div className="flex flex-wrap gap-2">
          {filterOptions.map((option) => (
            <button
              key={option.value}
              type="button"
              onClick={() => updateParams({ [filterParam]: option.value })}
              className={cn(
                "rounded-full border px-3 py-1.5 text-sm font-medium transition-colors",
                activeFilter === option.value
                  ? "border-accent bg-accent/15 text-accent-hover"
                  : "border-border text-text-secondary hover:text-text-primary"
              )}
              aria-pressed={activeFilter === option.value}
            >
              {option.label}
            </button>
          ))}
        </div>
      ) : null}
    </div>
  );
}

export { AdminSearchBar };
