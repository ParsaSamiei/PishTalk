import Link from "next/link";
import { ChevronLeft } from "lucide-react";

import { SITE_URL } from "@/lib/constants";
import { cn } from "@/lib/utils";

export interface BreadcrumbItem {
  readonly label: string;
  readonly href?: string;
}

interface BreadcrumbsProps {
  readonly items: readonly BreadcrumbItem[];
  readonly variant?: "default" | "light";
}

/**
 * Visual breadcrumb trail + JSON-LD BreadcrumbList, per
 * docs/03_Information_Architecture.md ("Show on Blog, Resources, Gallery,
 * Event Details, About, Rules, FAQ. Never show on homepage.") and
 * docs/08_SEO.md's structured-data requirements. Always prepends "خانه".
 */
function Breadcrumbs({ items, variant = "default" }: BreadcrumbsProps) {
  const allItems: BreadcrumbItem[] = [{ label: "خانه", href: "/" }, ...items];

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: allItems.map((item, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: item.label,
      item: item.href ? `${SITE_URL}${item.href}` : undefined,
    })),
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <nav
        aria-label="مسیر صفحه"
        className={cn(
          "flex items-center gap-1.5 text-sm",
          variant === "light" ? "text-white/70" : "text-text-secondary"
        )}
      >
        {allItems.map((item, index) => {
          const isLast = index === allItems.length - 1;
          return (
            <span key={`${item.label}-${index}`} className="flex items-center gap-1.5">
              {index > 0 ? <ChevronLeft className="size-3.5" aria-hidden="true" /> : null}
              {item.href && !isLast ? (
                <Link
                  href={item.href}
                  className={variant === "light" ? "hover:text-white" : "hover:text-text-primary"}
                >
                  {item.label}
                </Link>
              ) : (
                <span
                  aria-current={isLast ? "page" : undefined}
                  className={variant === "light" ? "text-white" : "text-text-primary"}
                >
                  {item.label}
                </span>
              )}
            </span>
          );
        })}
      </nav>
    </>
  );
}

export { Breadcrumbs };
