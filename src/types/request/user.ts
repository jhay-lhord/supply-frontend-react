import { z } from "zod"

export const userLoginSchema = z.object({
  email: z.string().min(1, "Required").email("Email must be a valid email"),
  password: z.string().min(8, "The password should be at least 8 characters")
})

export type userLoginType = z.infer<typeof userLoginSchema>

export interface UserResponse {
  employee_id: string;
  first_name: string;
  last_name: string;
  role: string;
  email: string;
  password: string;
  password2: string;
}

export const userUpdateSchema = z.object({
  first_name: z.string().min(1, "First name must not be empty"),
  last_name: z.string().min(1, "Last name must not be empty"),
  email: z.string().min(1, "Required").email("Email must be a valid email"),
})

export type userUpdateType = z.infer<typeof userUpdateSchema>

export const userUpdatePasswordSchema = z.object({
  old_password: z.string().min(8, "The password should be at least 8 characters"),
  new_password: z.string().min(8, "The password should be at least 8 characters"),
  confirm_password: z.string().min(8, "The password should be at least 8 characters")
}).refine((data) => data.new_password === data.confirm_password, {
  message: "Password didn't match",
  path: ["confirm_password"],
});

export type userUpdatePasswordType = z.infer<typeof userUpdatePasswordSchema>;



