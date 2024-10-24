import { z } from "zod";

export const itemSchema = z.object({
  id: z.string().optional(),
  purchase_request: z.string(),
  item_no: z.string().min(1, { message: "Item No is required" }),
  stock_property_no: z.string().min(1, { message: "Item property is required" }),
  unit: z.string().min(1, { message: "Unit is required" }),
  item_description: z.string().min(1, { message: "Description is required" }),
  quantity: z.number().min(1, { message: "Must be at least 1" }),
  unit_cost: z.number().min(0, { message: "Unit cost must be non-negative" }),
  total_cost: z.number().min(0, { message: "Total cost must be non-negative" }),
});

export type ItemType = z.infer<typeof itemSchema>;
