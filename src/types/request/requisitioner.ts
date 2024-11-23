import { z } from "zod";

export const requisitionerSchema = z.object({
  requisition_id: z.string().min(1, { message: "name is required" }),
  name: z.string().min(1, { message: "name is required" }),
  gender: z.string().min(1, { message: "gender is required" }),
  department: z.string().min(1, { message: "department is required" }),
  designation: z.string().min(1, { message: "designation is required" }),
});

export type RequisitionerType = z.infer<typeof requisitionerSchema>;