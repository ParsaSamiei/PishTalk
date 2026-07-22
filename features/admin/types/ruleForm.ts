import { z } from "zod";

export const ruleFormSchema = z.object({
  title: z.string().trim().min(3, "عنوان باید حداقل ۳ حرف باشد").max(150),
  description: z.string().trim().min(5, "توضیحات باید حداقل ۵ حرف باشد").max(500),
  icon: z.enum(["respect", "community", "discussion"]).optional().or(z.literal("")),
  sortOrder: z.coerce.number().int().min(0).default(0),
  published: z.boolean().default(true),
});

export type RuleFormValues = z.infer<typeof ruleFormSchema>;
