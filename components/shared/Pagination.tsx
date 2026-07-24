"use client";

import * as React from "react";
import Link from "next/link";
import { usePathname, useSearchParams } from "next/navigation";
import { ChevronRight, ChevronLeft } from "lucide-react";

import { cn } from "@/lib/utils";

interface PaginationProps {
  readonly currentPage: number;
  readonly totalPages: number;
  readonly pageParam?: string;
}

/**
 * URL-driven pagination control, per docs/05_DATABASE.md ("Pagination:
 * Default 12 items, Admin 25 items"). Keeps the results list a Server
 * Component — this only builds links, it doesn't fetch anything.
 */
function Pagination({ currentPage, totalPages, pageParam = "page" }: PaginationProps) {
  const pathname = usePathname();
  const searchParams = useSearchParams();

  if (totalPages <= 1) return null;

  function hrefForPage(page: number) {
    const params = new URLSearchParams(searchParams.toString());
    params.set(pageParam, String(page));
    return `${pathname}?${params.toString()}`;
  }

  const pages = Array.from({ length: totalPages }, (_, i) => i + 1).filter(
    (page) => page === 1 || page === totalPages || Math.abs(page - currentPage) <= 1
  );

  return (
    <nav aria-label="صفحه‌بندی" className="flex items-center justify-center gap-1">
      <Link
        href={hrefForPage(Math.max(1, currentPage - 1))}
        aria-disabled={currentPage === 1}
        className={cn(
          "flex size-9 items-center justify-center rounded-[var(--radius-button)] text-text-secondary hover:bg-surface-secondary",
          currentPage === 1 && "pointer-events-none opacity-40"
        )}
      >
        <ChevronRight className="size-4" aria-hidden="true" />
      </Link>

      {pages.map((page, index) => {
        const prevPage = pages[index - 1];
        const showEllipsis = prevPage !== undefined && page - prevPage > 1;
        return (
          <React.Fragment key={page}>
            {showEllipsis ? <span className="px-1 text-text-light">…</span> : null}
            <Link
              href={hrefForPage(page)}
              aria-current={page === currentPage ? "page" : undefined}
              className={cn(
                "flex size-9 items-center justify-center rounded-[var(--radius-button)] text-sm font-medium",
                page === currentPage
                  ? "bg-primary text-white"
                  : "text-text-secondary hover:bg-surface-secondary"
              )}
            >
              {page}
            </Link>
          </React.Fragment>
        );
      })}

      <Link
        href={hrefForPage(Math.min(totalPages, currentPage + 1))}
        aria-disabled={currentPage === totalPages}
        className={cn(
          "flex size-9 items-center justify-center rounded-[var(--radius-button)] text-text-secondary hover:bg-surface-secondary",
          currentPage === totalPages && "pointer-events-none opacity-40"
        )}
      >
        <ChevronLeft className="size-4" aria-hidden="true" />
      </Link>
    </nav>
  );
}

export { Pagination };
