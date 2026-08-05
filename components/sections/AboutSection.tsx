import Link from "next/link";
import { Bot, Cpu, Sparkles } from "lucide-react";

import { Container } from "@/components/layout/Container";
import { Section } from "@/components/layout/Section";
import { SectionTitle } from "@/components/shared/SectionTitle";
import { Button } from "@/components/ui/Button";
import { Reveal } from "@/components/animations/Reveal";
import { CircuitBackground } from "@/components/illustrations/CircuitBackground";
import { FloatingIcon } from "@/components/illustrations/FloatingIcon";
import { ForwardArrow } from "@/components/shared/DirectionalIcon";
import { getDictionary } from "@/lib/i18n/server";

/**
 * "Why does Pishtalk exist?" homepage section. The text column carries the
 * copy; the illustrated panel is purely atmospheric (circuit backdrop +
 * drifting tech icons) echoing the Hero without introducing new claims.
 *
 * This section skips the shared `circuit` texture at the outer `<Section>`
 * level on purpose: the panel already carries its own denser circuit
 * pattern, and layering a second, differently-phased grid right behind it
 * is what made the two look misaligned rather than like one cohesive motif.
 */
async function AboutSection() {
  const d = await getDictionary();

  return (
    <Section id="about">
      <Container className="grid gap-10 lg:grid-cols-2 lg:items-center bg-surface-secondary">
        <Reveal className="flex flex-col gap-6">
          <SectionTitle
            eyebrow={d.about.eyebrow}
            title={d.about.title}
            description={d.about.description}
          />
          <p className="w-full text-justify leading-relaxed text-text-secondary">
            {d.about.body}
          </p>
          <Button asChild variant="outline" className="self-start">
            <Link href="/about">
              {d.common.viewMore}
              <ForwardArrow className="size-4" aria-hidden="true" />
            </Link>
          </Button>
        </Reveal>

        <Reveal delay={0.15}>
          <div className="relative mx-auto aspect-square w-full max-w-md overflow-hidden rounded-[var(--radius-hero)] border border-border bg-surface lg:mx-0 lg:ms-auto dark:bg-primary">
            <CircuitBackground
              id="about-panel"
              size={60}
              className="text-primary/[0.05] dark:text-white/[0.07]"
            />
            <div
              aria-hidden="true"
              className="pointer-events-none absolute inset-0 bg-[radial-gradient(70%_60%_at_50%_30%,rgba(244,185,66,0.16),transparent_70%)]"
            />
            <FloatingIcon
              icon={Sparkles}
              size="sm"
              className="border-border bg-surface-secondary text-text-secondary dark:border-white/10 dark:bg-white/5 dark:text-white/70 top-[16%] start-[14%]"
              style={{ animationDelay: "-1s" }}
            />
            <FloatingIcon
              icon={Cpu}
              size="sm"
              className="border-border bg-surface-secondary text-sky-600 dark:border-white/10 dark:bg-white/5 dark:text-sky-300 bottom-[20%] end-[16%]"
              style={{ animationDelay: "-3.4s" }}
            />
            <div className="absolute inset-0 flex items-center justify-center">
              <span className="flex size-28 items-center justify-center rounded-full border border-border bg-surface-secondary text-text-secondary backdrop-blur-sm dark:border-white/15 dark:bg-white/5 dark:text-white/80">
                <Bot className="size-12 text-accent" aria-hidden="true" />
              </span>
            </div>
          </div>
        </Reveal>
      </Container>
    </Section>
  );
}

export { AboutSection };
