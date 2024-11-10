import { z } from "zod"

export const userLoginSchema = z.object({
  email: z.string().min(1, "Required").email("Email must be a valid email"),
  password: z.string().min(8, "The password should be at least 8 characters")
})

export type userLoginType = z.infer<typeof userLoginSchema>