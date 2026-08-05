import {
  Users,
  Lightbulb,
  Cpu,
  Mic,
  Handshake,
  TrendingUp,
} from "lucide-react";

import { Container } from "@/components/layout/Container";
import { Section } from "@/components/layout/Section";
import { SectionTitle } from "@/components/shared/SectionTitle";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/Card";
import { Reveal } from "@/components/animations/Reveal";
import { getDictionary } from "@/lib/i18n/server";

const REASONS = [
  { icon: Lightbulb, key: "learning" },
  { icon: Users, key: "networking" },
  { icon: Cpu, key: "tech" },
  { icon: Mic, key: "talks" },
  { icon: Handshake, key: "community" },
  { icon: TrendingUp, key: "growth" },
] as const;

/**
 * "Why should I participate?" homepage section.
 */
async function WhyAttendSection() {
  const d = await getDictionary();

  return (
    <Section id="why-attend" className="bg-surface-secondary" circuit>
      <Container className="flex flex-col gap-10 ">
        <Reveal className="mx-auto">
          <SectionTitle
            eyebrow={d.whyAttend.eyebrow}
            title={d.whyAttend.title}
            align="center"
          />
        </Reveal>
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {REASONS.map(({ icon: Icon, key }, index) => (
            <Reveal key={key} delay={index * 0.08} className="h-full">
              <Card className="group h-full overflow-hidden transition-all duration-300 hover:-translate-y-1.5 hover:border-accent/40 hover:shadow-[0_16px_40px_-24px_rgba(244,185,66,0.55)]">
                <div className="h-1 w-full scale-x-0 bg-linear-to-l from-accent to-sky-400 transition-transform duration-300 group-hover:scale-x-100" />
                <CardHeader>
                  <div className="mb-2 flex size-11 items-center justify-center rounded-xl bg-accent/15 text-accent-hover transition-transform duration-300 group-hover:-rotate-6 group-hover:scale-110">
                    <Icon className="size-5" aria-hidden="true" />
                  </div>
                  <CardTitle>{d.whyAttend.items[key].title}</CardTitle>
                </CardHeader>
                <CardDescription>
                  {d.whyAttend.items[key].description}
                </CardDescription>
              </Card>
            </Reveal>
          ))}
        </div>
      </Container>
    </Section>
  );
}

export { WhyAttendSection };
