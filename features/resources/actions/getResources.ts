import { prisma } from "@/lib/prisma";
import type { ResourceSummary } from "@/features/resources/types/resource";

/**
 * Resources for the homepage "Educational Resources" section and the
 * /resources listing. Sorted alphabetically per docs/05_DATABASE.md
 * ("Sorting: Resources: Alphabetical").
 */
export async function getLatestResources(limit = 6): Promise<ResourceSummary[]> {
  try {
    const resources = await prisma.resource.findMany({
      where: { deletedAt: null },
      orderBy: { title: "asc" },
      take: limit,
    });

    return resources.map((resource) => ({
      id: resource.id,
      title: resource.title,
      description: resource.description,
      resourceType: resource.resourceType as ResourceSummary["resourceType"],
      fileUrl: resource.fileUrl,
      externalUrl: resource.externalUrl,
    }));
  } catch {
    return [];
  }
}
