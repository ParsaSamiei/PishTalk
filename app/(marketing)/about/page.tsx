import type { Metadata } from "next";
import Link from "next/link";

import { Container } from "@/components/layout/Container";
import { Section } from "@/components/layout/Section";
import { Breadcrumbs } from "@/components/shared/Breadcrumbs";
import { Button } from "@/components/ui/Button";
import { PISHNAM_URL, SITE_URL } from "@/lib/constants";

export const metadata: Metadata = {
  title: "درباره ما",
  description: "درباره پیشتاک و پژوهشکده رباتیک پیشنام.",
  alternates: { canonical: `${SITE_URL}/about` },
};

export default function AboutPage() {
  return (
    <Section className="pt-12">
      <Container className="mx-auto flex max-w-3xl flex-col gap-8">
        <Breadcrumbs items={[{ label: "درباره ما" }]} />
        <div className="flex flex-col gap-3">
          <h1 className="text-3xl font-bold text-text-primary sm:text-4xl">درباره پیشتاک</h1>
          <p className="text-lg text-text-secondary">
            جامعه‌ای برای مهندسان رباتیک، هوش مصنوعی و فناوری.
          </p>
        </div>

        <div className="flex flex-col gap-6 leading-relaxed text-text-secondary">
          <p>
            پیشتاک رویداد ماهانه‌ای است که توسط پژوهشکده رباتیک پیشنام برگزار می‌شود. هدف
            ما ایجاد فضایی است که در آن مهندسان، دانشجویان و علاقه‌مندان به رباتیک و هوش
            مصنوعی بتوانند دانش خود را به اشتراک بگذارند، از تجربه‌های یکدیگر یاد بگیرند
            و ارتباطات حرفه‌ای واقعی شکل دهند.
          </p>
          <p>
            هر رویداد پیشتاک شامل یک سخنرانی تخصصی، بحث آزاد و زمانی برای شبکه‌سازی است.
            ما به کیفیت محتوا و کوچک نگه‌داشتن جامعه اهمیت می‌دهیم تا هر شرکت‌کننده فرصت
            واقعی برای گفتگو داشته باشد.
          </p>
          <p>
            پیشتاک بخشی از فعالیت‌های آموزشی و اجتماعی پژوهشکده رباتیک پیشنام است که در
            زمینه آموزش رباتیک، برگزاری مسابقات و توسعه تیم‌های دانشگاهی فعالیت می‌کند.
          </p>
        </div>

        <Button asChild variant="outline" className="self-start">
          <a href={PISHNAM_URL} target="_blank" rel="noreferrer noopener">
            مشاهده وب‌سایت پیشنام
          </a>
        </Button>

        <div className="flex flex-col gap-3 rounded-[var(--radius-card)] border border-border bg-surface-secondary p-6 sm:flex-row sm:items-center sm:justify-between">
          <p className="text-text-primary">می‌خواهید در رویداد بعدی شرکت کنید؟</p>
          <Button asChild>
            <Link href="/events">مشاهده رویدادها</Link>
          </Button>
        </div>
      </Container>
    </Section>
  );
}
