import { z } from "zod";

export const registrationFormSchema = z.object({
  firstName: z.string().trim().min(2, "نام باید حداقل ۲ حرف باشد").max(50),
  lastName: z.string().trim().min(2, "نام خانوادگی باید حداقل ۲ حرف باشد").max(50),
  phone: z
    .string()
    .trim()
    .regex(/^09\d{9}$/, "شماره موبایل باید با ۰۹ شروع شود و ۱۱ رقم باشد"),
  email: z.string().trim().email("ایمیل معتبر نیست").optional().or(z.literal("")),
  university: z.string().trim().max(150).optional().or(z.literal("")),
  company: z.string().trim().max(150).optional().or(z.literal("")),
  profession: z.string().trim().max(150).optional().or(z.literal("")),
  notes: z.string().trim().max(500).optional().or(z.literal("")),
});

export type RegistrationFormValues = z.infer<typeof registrationFormSchema>;
