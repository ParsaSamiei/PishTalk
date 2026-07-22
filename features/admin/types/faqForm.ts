import { z } from "zod";

export const faqFormSchema = z.object({
  question: z.string().trim().min(5, "سوال باید حداقل ۵ حرف باشد").max(300),
  answer: z.string().trim().min(5, "پاسخ باید حداقل ۵ حرف باشد").max(2000),
  sortOrder: z.coerce.number().int().min(0).default(0),
  published: z.boolean().default(true),
});

export type FaqFormValues = z.infer<typeof faqFormSchema>;
