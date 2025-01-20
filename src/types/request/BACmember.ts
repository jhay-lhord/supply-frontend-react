import { z } from "zod";

export const BACmemberSchema = z.object({
  member_id: z.string().min(1),
  first_name: z.string().min(1, { message: "name is required" }),
  last_name: z.string().min(1, { message: "name is required" }),
  middle_name: z.string().optional(),
  name: z.string().optional(), // i will be concatenate th first_name, last_name and middle_name later in save
  designation: z.string().min(1, { message: "designation is required" }),
});

export type BACmemberType = z.infer<typeof BACmemberSchema>;


export const EditBACmemberSchema = z.object({
  member_id: z.string().min(1),
  first_name: z.string().optional(),
  last_name: z.string().optional(),
  middle_name: z.string().optional(),
  name: z.string().optional(), // i will be concatenate th first_name, last_name and middle_name later in save
  designation: z.string().min(1, { message: "designation is required" }),
});

export type EditBACmemberType = z.infer<typeof BACmemberSchema>;