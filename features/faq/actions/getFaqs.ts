import { prisma } from "@/lib/prisma";
import type { FaqItem } from "@/features/faq/types/faq";

export async function getFaqs(limit?: number): Promise<FaqItem[]> {
  try {
    const faqs = await prisma.faq.findMany({
      where: { published: true },
      orderBy: { sortOrder: "asc" },
      take: limit,
    });

    return faqs.map((faq) => ({
      id: faq.id,
      question: faq.question,
      questionEn: faq.questionEn,
      answer: faq.answer,
      answerEn: faq.answerEn,
    }));
  } catch {
    return [];
  }
}
