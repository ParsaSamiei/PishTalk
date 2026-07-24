import type { Metadata } from "next";
import Link from "next/link";
import { CheckCircle2 } from "lucide-react";

import { Container } from "@/components/layout/Container";
import { Section } from "@/components/layout/Section";
import { Button } from "@/components/ui/Button";

export const metadata: Metadata = {
  title: "ثبت‌نام موفق",
  robots: { index: false },
};

export default function RegisterSuccessPage() {
  return (
    <Section className="flex min-h-[70vh] items-center">
      <Container className="mx-auto flex max-w-md flex-col items-center gap-4 text-center">
        <CheckCircle2 className="size-16 text-success" aria-hidden="true" />
        <h1 className="text-2xl font-bold text-text-primary">ثبت‌نام شما با موفقیت انجام شد</h1>
        <p className="text-text-secondary">
          جزئیات رویداد به‌زودی برای شما ارسال خواهد شد. منتظر دیدارتان هستیم!
        </p>
        <div className="mt-4 flex gap-3">
          <Button asChild>
            <Link href="/">بازگشت به صفحه اصلی</Link>
          </Button>
          <Button asChild variant="outline">
            <Link href="/events">مشاهده رویدادها</Link>
          </Button>
        </div>
      </Container>
    </Section>
  );
}
