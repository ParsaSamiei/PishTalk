import { Container } from "@/components/layout/Container";
import { Section } from "@/components/layout/Section";
import { Skeleton } from "@/components/ui/Skeleton";

/**
 * Shown while any (marketing) page is loading, per docs/06_FRONTEND_ARCHITECTURE.md
 * ("Every route: loading.tsx") and docs/04_DESIGN_SYSTEM.md ("Skeleton
 * Components... Never use spinners for page loading").
 */
export default function MarketingLoading() {
  return (
    <Section className="pt-12">
      <Container className="flex flex-col gap-10">
        <div className="flex flex-col gap-3">
          <Skeleton className="h-9 w-64" />
          <Skeleton className="h-5 w-96 max-w-full" />
        </div>
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {Array.from({ length: 6 }).map((_, index) => (
            <div key={index} className="flex flex-col gap-4 rounded-[var(--radius-card)] border border-border p-4">
              <Skeleton className="aspect-video w-full" />
              <Skeleton className="h-5 w-3/4" />
              <Skeleton className="h-4 w-1/2" />
            </div>
          ))}
        </div>
      </Container>
    </Section>
  );
}
