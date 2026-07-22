import Link from "next/link";
import { Compass } from "lucide-react";

import { Container } from "@/components/layout/Container";
import { Section } from "@/components/layout/Section";
import { Button } from "@/components/ui/Button";

export default function NotFound() {
  return (
    <Section className="flex min-h-[70vh] items-center">
      <Container className="mx-auto flex max-w-md flex-col items-center gap-4 text-center">
        <Compass className="size-16 text-accent-hover" aria-hidden="true" />
        <h1 className="text-2xl font-bold text-text-primary">صفحه مورد نظر پیدا نشد</h1>
        <p className="text-text-secondary">
          ممکن است لینک اشتباه باشد یا این صفحه جابه‌جا شده باشد.
        </p>
        <Button asChild>
          <Link href="/">بازگشت به صفحه اصلی</Link>
        </Button>
      </Container>
    </Section>
  );
}
