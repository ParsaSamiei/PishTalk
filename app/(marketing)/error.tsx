"use client";

import * as React from "react";
import { AlertTriangle } from "lucide-react";

import { Container } from "@/components/layout/Container";
import { Section } from "@/components/layout/Section";
import { Button } from "@/components/ui/Button";

/**
 * Route-level error boundary, per docs/06_FRONTEND_ARCHITECTURE.md
 * ("Every route: error.tsx") and docs/03_Information_Architecture.md
 * ("500: Simple explanation, Retry button"). Never exposes the raw
 * technical error message to the visitor.
 */
export default function MarketingError({ reset }: { error: Error; reset: () => void }) {
  React.useEffect(() => {
    // Intentionally no client-side reporting call here yet — wire up
    // Sentry or similar once a provider is chosen.
  }, []);

  return (
    <Section className="flex min-h-[70vh] items-center">
      <Container className="mx-auto flex max-w-md flex-col items-center gap-4 text-center">
        <AlertTriangle className="size-16 text-danger" aria-hidden="true" />
        <h1 className="text-2xl font-bold text-text-primary">مشکلی پیش آمد</h1>
        <p className="text-text-secondary">
          متاسفانه در بارگذاری این صفحه خطایی رخ داد. لطفاً دوباره تلاش کنید.
        </p>
        <Button onClick={reset}>تلاش دوباره</Button>
      </Container>
    </Section>
  );
}
