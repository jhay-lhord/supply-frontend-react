import { z } from "zod";

export const requisitionerSchema = z.object({
  requisition_id: z.string().min(1),
  first_name: z.string().min(1, { message: "name is required" }),
  last_name: z.string().min(1, { message: "name is required" }),
  middle_name: z.string().optional(),
  name: z.string().optional(),// i will be concatenate the first_name, last_name, middle_name into name later in saving
  gender: z.string().min(1, { message: "gender is required" }),
  department: z.string().min(1, { message: "department is required" }),
  designation: z.string().min(1, { message: "designation is required" }),
});

export type RequisitionerType = z.infer<typeof requisitionerSchema>;

export const EditRequisitionerSchema = z.object({
  requisition_id: z.string().min(1),
  first_name: z.string().optional(),
  last_name: z.string().optional(),
  middle_name: z.string().optional(),
  name: z.string().optional(),// i will be concatenate the first_name, last_name, middle_name into name later in saving
  gender: z.string().min(1, { message: "gender is required" }),
  department: z.string().min(1, { message: "department is required" }),
  designation: z.string().min(1, { message: "designation is required" }),
});

export type EditRequisitionerType = z.infer<typeof requisitionerSchema>;