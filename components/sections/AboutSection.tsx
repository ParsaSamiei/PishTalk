import Link from "next/link";
import { ArrowLeft } from "lucide-react";

import { Container } from "@/components/layout/Container";
import { Section } from "@/components/layout/Section";
import { SectionTitle } from "@/components/shared/SectionTitle";
import { Button } from "@/components/ui/Button";

/**
 * "Why does Pishtalk exist?" homepage section.
 */
function AboutSection() {
  return (
    <Section id="about" className="bg-surface-secondary">
      <Container className="grid gap-10 lg:grid-cols-2 lg:items-center">
        <SectionTitle
          eyebrow="درباره پیشتاک"
          title="جایی که ایده‌ها به گفتگو تبدیل می‌شوند"
          description="پیشتاک رویداد ماهانه‌ای است که توسط پژوهشکده رباتیک پیشنام برگزار می‌شود؛ فضایی برای مهندسان، دانشجویان و علاقه‌مندان رباتیک و هوش مصنوعی تا یاد بگیرند، تجربه‌هایشان را به اشتراک بگذارند و با یکدیگر آشنا شوند."
        />
        <div className="flex flex-col gap-6">
          <p className="text-text-secondary leading-relaxed">
            هر رویداد پیشتاک میزبان یک سخنرانی تخصصی، بحث آزاد و فرصتی برای شبکه‌سازی
            میان اعضای جامعه است. تمرکز ما بر کیفیت محتوا و ارتباط واقعی میان
            شرکت‌کنندگان است، نه صرفاً برگزاری یک رویداد بزرگ.
          </p>
          <Button asChild variant="outline" className="self-start">
            <Link href="/about">
              بیشتر بدانید
              <ArrowLeft className="size-4" aria-hidden="true" />
            </Link>
          </Button>
        </div>
      </Container>
    </Section>
  );
}

export { AboutSection };
