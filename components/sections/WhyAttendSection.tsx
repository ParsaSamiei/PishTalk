import { Users, Lightbulb, Cpu, Mic, Handshake, TrendingUp } from "lucide-react";

import { Container } from "@/components/layout/Container";
import { Section } from "@/components/layout/Section";
import { SectionTitle } from "@/components/shared/SectionTitle";
import { Card, CardHeader, CardTitle, CardDescription } from "@/components/ui/Card";

const REASONS = [
  {
    icon: Lightbulb,
    title: "یادگیری مشترک",
    description: "دانش و تجربه‌های عملی خود را با دیگر مهندسان به اشتراک بگذارید.",
  },
  {
    icon: Users,
    title: "شبکه‌سازی",
    description: "با مهندسان، دانشجویان و پژوهشگران هم‌حوزه آشنا شوید.",
  },
  {
    icon: Cpu,
    title: "جدیدترین فناوری‌ها",
    description: "از تازه‌ترین پیشرفت‌های رباتیک و هوش مصنوعی باخبر شوید.",
  },
  {
    icon: Mic,
    title: "سخنرانی‌های تخصصی",
    description: "از تجربه سخنرانان متخصص در هر رویداد بهره ببرید.",
  },
  {
    icon: Handshake,
    title: "جامعه‌ای فعال",
    description: "بخشی از جامعه‌ای رو به رشد از مهندسان و علاقه‌مندان فناوری شوید.",
  },
  {
    icon: TrendingUp,
    title: "رشد حرفه‌ای",
    description: "فرصت‌های همکاری و رشد شغلی خود را در حوزه رباتیک گسترش دهید.",
  },
] as const;

/**
 * "Why should I participate?" homepage section.
 */
function WhyAttendSection() {
  return (
    <Section id="why-attend">
      <Container className="flex flex-col gap-10">
        <SectionTitle
          eyebrow="چرا پیشتاک؟"
          title="چرا باید در پیشتاک شرکت کنید"
          align="center"
          className="mx-auto"
        />
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {REASONS.map(({ icon: Icon, title, description }) => (
            <Card key={title} className="hover:-translate-y-0.5">
              <CardHeader>
                <div className="mb-2 flex size-11 items-center justify-center rounded-xl bg-accent/15 text-accent-hover">
                  <Icon className="size-5" aria-hidden="true" />
                </div>
                <CardTitle>{title}</CardTitle>
              </CardHeader>
              <CardDescription>{description}</CardDescription>
            </Card>
          ))}
        </div>
      </Container>
    </Section>
  );
}

export { WhyAttendSection };
