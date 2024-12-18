import { z } from "zod";

const registerFormSchema = z
  .object({
    employee_id: z.string().min(1, "Employee ID is required"),
    first_name: z.string().min(1, "Firstname is required"),
    last_name: z.string().min(1, "Lastname is required"),
    role: z.string().min(1, "Please select a role to continue"),
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
