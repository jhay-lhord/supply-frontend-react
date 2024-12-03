import { z } from "zod";

const registerFormSchema = z
  .object({
    employee_id: z.string(),
    first_name: z.string(),
    last_name: z.string(),
    role: z.string(),
    email: z.string().min(1, "Email is required").email(),
    password: z.string().min(8, "Password should be minimum of 8 characters"),
    password2: z
      .string()
      .min(8, "Password should minimum of 8 characters"),
  })
  .refine((data) => data.password === data.password2, {
    message: "Password didn't match",
    path: ["password2"],
  });

type RegisterInputData = z.infer<typeof registerFormSchema>;

export { registerFormSchema };

export type { RegisterInputData }
