import { z } from "zod";

export const faqFormSchema = z.object({
  question: z.string().trim().min(5, "سوال باید حداقل ۵ حرف باشد").max(300),
  answer: z.string().trim().min(5, "پاسخ باید حداقل ۵ حرف باشد").max(2000),
  // Optional English translations. Blank means "not translated yet" and the
  // public site falls back to the Persian text (lib/i18n/content.ts).
  questionEn: z.string().trim().max(300).optional().or(z.literal("")),
  answerEn: z.string().trim().max(2000).optional().or(z.literal("")),
  sortOrder: z.coerce.number().int().min(0).default(0),
  published: z.boolean().default(true),
});

export type FaqFormValues = z.infer<typeof faqFormSchema>;
