import Link from "next/link";
import { ArrowLeft } from "lucide-react";

import { Container } from "@/components/layout/Container";
import { Button } from "@/components/ui/Button";
import { Countdown } from "@/components/shared/Countdown";
import type { EventDetail } from "@/features/events/types/event";
import { formatEventDate } from "@/utils/formatDate";

interface HeroSectionProps {
  readonly nextEvent: EventDetail | null;
}

/**
 * Homepage Hero: communicates what Pishtalk is within the first few
 * seconds, per docs/01_PRODUCT.md success criteria.
 */
function HeroSection({ nextEvent }: HeroSectionProps) {
  return (
    <section className="relative flex min-h-[80vh] items-center overflow-hidden bg-primary text-white">
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(60%_50%_at_50%_0%,rgba(244,185,66,0.18),transparent_70%)]"
      />
      <Container className="relative flex flex-col items-center gap-8 py-32 text-center">
        <span className="rounded-full border border-white/15 bg-white/5 px-4 py-1.5 text-sm text-white/80">
          پژوهشکده رباتیک پیشنام
        </span>

        <h1 className="max-w-3xl text-4xl font-bold leading-tight sm:text-5xl lg:text-6xl">
          جامعه‌ای برای مهندسان رباتیک، هوش مصنوعی و فناوری
        </h1>

        <p className="max-w-xl text-lg text-white/70">
          هر ماه گرد هم می‌آییم تا یاد بگیریم، گفتگو کنیم و شبکه‌سازی کنیم؛ در کنار
          مهندسان و علاقه‌مندانی که مسیر مشابهی را دنبال می‌کنند.
        </p>

        {nextEvent ? (
          <div className="flex flex-col items-center gap-4">
            <p className="text-sm text-white/60">
              رویداد بعدی · {formatEventDate(nextEvent.date)}
            </p>
            <Countdown target={nextEvent.date} />
          </div>
        ) : null}

        <div className="flex flex-col gap-3 sm:flex-row">
          <Button asChild variant="accent" size="lg">
            <Link href={nextEvent ? `/events/${nextEvent.slug}` : "/events"}>
              ثبت نام رویداد
            </Link>
          </Button>
          <Button
            asChild
            variant="outline"
            size="lg"
            className="border-white/25 text-white hover:bg-white/10"
          >
            <Link href="/about">
              درباره پیشتاک
              <ArrowLeft className="size-4" aria-hidden="true" />
            </Link>
          </Button>
        </div>
      </Container>
    </section>
  );
}

export { HeroSection };
