import { prisma } from "@/lib/prisma";
import type { FaqItem } from "@/features/faq/types/faq";

export async function getFaqs(limit?: number): Promise<FaqItem[]> {
  try {
    const faqs = await prisma.faq.findMany({
      where: { published: true },
      orderBy: { sortOrder: "asc" },
      take: limit,
    });

    return faqs.map((faq) => ({ id: faq.id, question: faq.question, answer: faq.answer }));
  } catch {
    return [];
  }
}
