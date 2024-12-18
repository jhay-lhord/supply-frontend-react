import { z } from "zod";

export const BACmemberSchema = z.object({
  member_id: z.string().min(1),
  name: z.string().min(1, { message: "name is required" }),
  designation: z.string().min(1, { message: "designation is required" }),
});

export type BACmemberType = z.infer<typeof BACmemberSchema>;