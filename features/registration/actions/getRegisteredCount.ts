import { prisma } from "@/lib/prisma";

/**
 * Total number of people who have registered across every PishTalk event,
 * past and upcoming. Used for the homepage social-proof counter.
 *
 * Cancelled registrations are excluded — someone who backed out never
 * showed up, so counting them would inflate the number past what anyone
 * could verify at an event. REGISTERED and ATTENDED both count: a person
 * who attended was, by definition, registered at some point.
 *
 * Swallows errors the same way features/events/actions/getEvents.ts does,
 * so a cold/unreachable DB at build time degrades to 0 instead of crashing
 * the homepage (see the `dynamic = "force-dynamic"` note in page.tsx).
 */
export async function getTotalRegisteredCount(): Promise<number> {
  try {
    return await prisma.registration.count({
      where: { status: { in: ["REGISTERED", "ATTENDED"] } },
    });
  } catch {
    return 0;
  }
}
