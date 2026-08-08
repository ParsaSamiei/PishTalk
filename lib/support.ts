import { prisma } from "@/lib/prisma";
import type { SponsorItem } from "@/types/sponsor";
import type { SupportPaymentInfo } from "@/types/support";

/**
 * Supporters shown on the public /support page, managed from
 * /admin/sponsors (Sponsor model). Independent of SPONSORS in
 * lib/sponsors.ts, which is a separate, static list used only by the
 * footer's logo strip and is unaffected by this.
 */
export async function getSponsors(limit?: number): Promise<SponsorItem[]> {
  try {
    const sponsors = await prisma.sponsor.findMany({
      where: { published: true },
      orderBy: { sortOrder: "asc" },
      take: limit,
    });

    return sponsors.map((sponsor) => ({
      id: sponsor.id,
      name: sponsor.name,
      logo: sponsor.logo,
      url: sponsor.url,
      description: sponsor.description,
      descriptionEn: sponsor.descriptionEn,
    }));
  } catch {
    return [];
  }
}

/**
 * The bank details to show on /support, or null when the payment block should
 * not appear at all.
 *
 * This is the single source of truth for that decision. Both the page and the
 * receipt upload route call it, so the UI and the server-side enforcement can
 * never disagree — a visitor cannot POST a receipt to an endpoint whose form
 * is not being rendered.
 *
 * Fails closed: a missing settings row, a disabled toggle, blank details, or a
 * database error all return null. Showing an empty payment box or accepting
 * receipts for a card number nobody configured would both be worse than
 * showing nothing.
 */
export async function getSupportPaymentInfo(): Promise<SupportPaymentInfo | null> {
  try {
    const settings = await prisma.siteSettings.findFirst({
      select: {
        supportPaymentEnabled: true,
        supportCardNumber: true,
        supportCardHolder: true,
        supportSheba: true,
      },
    });

    if (!settings?.supportPaymentEnabled) return null;
    if (!settings.supportCardNumber || !settings.supportCardHolder) return null;

    return {
      cardNumber: settings.supportCardNumber,
      cardHolder: settings.supportCardHolder,
      sheba: settings.supportSheba,
    };
  } catch {
    return null;
  }
}
