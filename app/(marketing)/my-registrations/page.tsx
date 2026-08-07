import type { Metadata } from "next";

import { Container } from "@/components/layout/Container";
import { Section } from "@/components/layout/Section";
import { MyRegistrationsLookup } from "@/features/registration/components/MyRegistrationsLookup";
import { getDictionary } from "@/lib/i18n/server";

export async function generateMetadata(): Promise<Metadata> {
  const d = await getDictionary();

  return {
    title: d.registration.lookupTitle,
    // Personal-lookup page, same reasoning as /register-success: nothing
    // here should show up in search results.
    robots: { index: false },
  };
}

export default async function MyRegistrationsPage() {
  const d = await getDictionary();

  return (
    <Section className="pt-12" circuit>
      <Container className="mx-auto flex max-w-xl flex-col gap-8">
        <div className="flex flex-col gap-3 text-center">
          <h1 className="text-3xl font-bold text-text-primary sm:text-4xl">
            {d.registration.lookupTitle}
          </h1>
          <p className="text-lg text-text-secondary">
            {d.registration.lookupDescription}
          </p>
        </div>

        <MyRegistrationsLookup />
      </Container>
    </Section>
  );
}
