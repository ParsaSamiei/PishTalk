import Link from "next/link";
import { BarChart3, Lightbulb, MessageSquare, Settings2 } from "lucide-react";

import { Container } from "@/components/layout/Container";
import { Section } from "@/components/layout/Section";
import { SectionTitle } from "@/components/shared/SectionTitle";
import { Button } from "@/components/ui/Button";
import { Reveal } from "@/components/animations/Reveal";
import { CircuitBackground } from "@/components/illustrations/CircuitBackground";
import { FloatingIcon } from "@/components/illustrations/FloatingIcon";
import { RobotMascot } from "@/components/illustrations/RobotMascot";
import { ForwardArrow } from "@/components/shared/DirectionalIcon";
import { getDictionary } from "@/lib/i18n/server";

/**
 * "Why does Pishtalk exist?" homepage section. The text column carries the
 * copy; the illustrated panel is purely atmospheric (circuit backdrop, a
 * chat-window motif, an orbiting ring of tech icons and the animated
 * RobotMascot on a podium) echoing the Hero without introducing new claims.
 *
 * This section skips the shared `circuit` texture at the outer `<Section>`
 * level on purpose: the panel already carries its own denser circuit
 * pattern, and layering a second, differently-phased grid right behind it
 * is what made the two look misaligned rather than like one cohesive motif.
 *
 * The panel is built entirely from theme tokens (surface/border/accent/
 * text-*) so it re-themes for free between light and dark mode — no
 * illustration-specific colors are hardcoded.
 */
async function AboutSection() {
  const d = await getDictionary();

  return (
    <Section id="about" className="bg-surface-secondary">
      {/* Inject custom keyframes for the enhanced floating effect */}
      <style
        dangerouslySetInnerHTML={{
          __html: `
          @keyframes enhanced-float {
            0%, 100% { transform: translateY(0px) translateX(0px) rotate(0deg); }
            33% { transform: translateY(-12px) translateX(4px) rotate(4deg); }
            66% { transform: translateY(6px) translateX(-4px) rotate(-4deg); }
          }
        `,
        }}
      />

      <Container className="grid gap-10 lg:grid-cols-2 lg:items-center text-justify ">
        <Reveal className="flex flex-col gap-6 [&_p]:text-justify">
          <SectionTitle
            eyebrow={d.about.eyebrow}
            title={d.about.title}
            description={d.about.description}
            className="max-w-none"
          />
          <p className="w-full leading-relaxed text-text-secondary ">
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
          <div className="relative mx-auto aspect-square w-full max-w-md overflow-hidden rounded-hero border border-border bg-surface lg:mx-0 lg:ms-auto dark:bg-primary">
            <CircuitBackground
              id="about-panel"
              size={60}
              className="text-primary/5 dark:text-white/[0.07]"
            />
            <div
              aria-hidden="true"
              className="pointer-events-none absolute inset-0 bg-[radial-gradient(70%_60%_at_50%_30%,rgba(244,185,66,0.16),transparent_70%)]"
            />

            {/* Dashed orbit ring threading the three floating icons together,
            echoing the "ideas in motion" concept from the brand brief. */}
            <svg
              aria-hidden="true"
              viewBox="0 0 200 200"
              className="pointer-events-none absolute inset-0 m-auto size-[74%] text-border dark:text-white/15"
            >
              <circle
                cx="100"
                cy="100"
                r="92"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeDasharray="3 8"
                strokeLinecap="round"
              />
            </svg>

            {/* Loose accent dots scattered around the ring, matching the
            sparse dot texture from the brand reference illustration. */}
            <span
              aria-hidden="true"
              className="absolute top-[10%] inset-s-[24%] size-2 rounded-full bg-accent/70"
            />
            <span
              aria-hidden="true"
              className="absolute bottom-[28%] inset-e-[12%] size-1.5 rounded-full bg-primary/30 dark:bg-white/30"
            />

            {/* Chat-window card: stands in for the "conversation" the copy
            talks about, mirroring the browser-chrome + message bubble
            from the reference illustration. */}
            <div className="absolute inset-x-[16%] top-[13%] overflow-hidden rounded-2xl border border-border bg-surface-secondary/60 shadow-sm backdrop-blur-sm dark:border-white/10 dark:bg-white/5">
              <div className="flex items-center gap-1.5 border-b border-border px-4 py-2.5 dark:border-white/10">
                <span className="size-2 rounded-full bg-accent/70" />
                <span className="size-2 rounded-full bg-accent/45" />
                <span className="size-2 rounded-full bg-accent/25" />
              </div>
              <div className="flex items-start gap-2.5 p-4">
                <span className="flex size-8 shrink-0 items-center justify-center rounded-lg bg-accent text-primary">
                  <MessageSquare className="size-4" aria-hidden="true" />
                </span>
                <div className="flex-1 space-y-1.5 pt-1.5">
                  <span className="block h-2 w-4/5 rounded-full bg-text-light/40" />
                  <span className="block h-2 w-3/5 rounded-full bg-text-light/25" />
                </div>
              </div>
            </div>

            {/* Mascot on a podium — the same hand-drawn, Framer Motion-animated
            robot used on the 404 page (blink, wave, float, glowing chest
            lights) instead of a static Lucide glyph, so the panel's
            focal point actually reads as alive. Staged like the
            "guest of honor" pose from the reference illustration; its
            own drawn ground shadow doubles as the podium's rim light. */}
            <div className="absolute inset-x-0 bottom-[7%] flex flex-col items-center">
              <div
                aria-hidden="true"
                className="absolute bottom-4 size-24 rounded-full bg-accent/20 blur-2xl"
              />
              <RobotMascot className="relative w-28 sm:w-32" />
              <span className="-mt-3 h-2.5 w-28 rounded-full bg-border/70 dark:bg-white/10" />
            </div>

            {/* Floating icons with enhanced-float overrides */}
            <FloatingIcon
              icon={Lightbulb}
              size="sm"
              className="border-border bg-surface-secondary text-accent-light dark:border-white/10 dark:bg-white/5 dark:text-accent top-[13%] inset-e-[10%]"
              style={{
                animation: "enhanced-float 6s ease-in-out infinite",
                animationDelay: "-1s",
              }}
            />
            <FloatingIcon
              icon={Settings2}
              size="sm"
              className="border-border bg-surface-secondary text-sky-600 dark:border-white/10 dark:bg-white/5 dark:text-sky-300 bottom-[10%] inset-s-[8%]"
              style={{
                animation: "enhanced-float 6.5s ease-in-out infinite",
                animationDelay: "-3.4s",
              }}
            />
            <FloatingIcon
              icon={BarChart3}
              size="sm"
              className="border-border bg-surface-secondary text-emerald-600 dark:border-white/10 dark:bg-white/5 dark:text-emerald-300 bottom-[8%] inset-e-[6%]"
              style={{
                animation: "enhanced-float 7s ease-in-out infinite",
                animationDelay: "-5.2s",
              }}
            />
          </div>
        </Reveal>
      </Container>
    </Section>
  );
}

export { AboutSection };
