import { z } from "zod";

/**
 * Shared client/server validation for the contact form.
 * Error messages are in Persian per docs/09_DEVELOPMENT_GUIDELINES.md.
 */
export const contactFormSchema = z.object({
  name: z.string().trim().min(2, "نام باید حداقل ۲ حرف باشد").max(100),
  email: z.string().trim().email("ایمیل معتبر نیست"),
  message: z.string().trim().min(10, "پیام باید حداقل ۱۰ حرف باشد").max(2000),
});

export type ContactFormValues = z.infer<typeof contactFormSchema>;
