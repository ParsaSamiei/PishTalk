import { prisma } from "@/lib/prisma";

/**
 * Total number of people who have registered across every PishTalk event,
 * past and upcoming. Used for the homepage social-proof counter.
 *
 * Cancelled and rejected registrations are excluded — someone who backed
 * out or wasn't accepted never showed up, so counting them would inflate
 * the number past what anyone could verify at an event. PENDING, APPROVED,
 * and ATTENDED all count: this counts everyone who submitted the form, not
 * just the subset an admin has approved so far, which matches what this
 * number always meant before the admin-approval workflow existed.
 *
 * Swallows errors the same way features/events/actions/getEvents.ts does,
 * so a cold/unreachable DB at build time degrades to 0 instead of crashing
 * the homepage (see the `dynamic = "force-dynamic"` note in page.tsx).
 */
export async function getTotalRegisteredCount(): Promise<number> {
  try {
    return await prisma.registration.count({
      where: { status: { in: ["PENDING", "APPROVED", "ATTENDED"] } },
    });
  } catch {
    return 0;
  }
}
