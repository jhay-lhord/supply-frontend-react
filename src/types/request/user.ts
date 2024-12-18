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
