import { prisma } from "@/lib/prisma";
import type { RuleItem } from "@/types/rule";

export async function getRules(limit?: number): Promise<RuleItem[]> {
  try {
    const rules = await prisma.rule.findMany({
      where: { published: true },
      orderBy: { sortOrder: "asc" },
      take: limit,
    });

    return rules.map((rule) => ({
      id: rule.id,
      title: rule.title,
      description: rule.description,
      icon: rule.icon,
    }));
  } catch {
    return [];
  }
}
