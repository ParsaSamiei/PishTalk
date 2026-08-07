import { prisma } from "@/lib/prisma";
import type { SponsorItem } from "@/types/sponsor";

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
