import type { Metadata } from "next";
import Link from "next/link";
import { CheckCircle2 } from "lucide-react";

import { Container } from "@/components/layout/Container";
import { Section } from "@/components/layout/Section";
import { Button } from "@/components/ui/Button";
import { getDictionary } from "@/lib/i18n/server";

export async function generateMetadata(): Promise<Metadata> {
  const d = await getDictionary();

  return {
    title: d.registration.successTitle,
    robots: { index: false },
  };
}

export default async function RegisterSuccessPage() {
  const d = await getDictionary();

  return (
    <Section className="flex min-h-[70vh] items-center" circuit>
      <Container className="mx-auto flex max-w-md flex-col items-center gap-4 text-center">
        <CheckCircle2 className="size-16 text-success" aria-hidden="true" />
        <h1 className="text-2xl font-bold text-text-primary">
          {d.registration.successHeading}
        </h1>
        <p className="text-text-secondary">{d.registration.successBody}</p>
        <div className="mt-4 flex gap-3">
          <Button asChild>
            <Link href="/">{d.common.backHome}</Link>
          </Button>
          <Button asChild variant="outline">
            <Link href="/events">{d.about.seeEvents}</Link>
          </Button>
        </div>
      </Container>
    </Section>
  );
}
