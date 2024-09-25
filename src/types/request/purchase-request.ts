import { z } from 'zod';

export const itemFormSchema = z.object({
  item_no: z.string().min(1, 'Required'),
  item_property: z.string().min(1, 'Required'),
  unit: z.string().min(1, 'Required'),
  item_description: z.string().min(1, 'Required'),
  quantity: z.string().min(1, 'Required'),
  unit_cost: z.string().min(1, 'Required'),
  total_cost: z.string().min(1, 'Required'),
});

export type ItemData = z.infer<typeof itemFormSchema>;

export const purchaseRequestFormSchema = z.object({
  pr_no: z.string().min(1, 'Required'),
  res_center_code: z.string().min(1, 'Required'),
  purpose: z.string().min(1, 'Required'),
  status: z.string().min(1, 'Required'),
  requested_by: z.string().min(1, 'Required'),
  approved_by: z.string().min(1, 'Required'),
  items: z.array(itemFormSchema), // Include items array in the schema
});

export type PurchaseRequestData = z.infer<typeof purchaseRequestFormSchema>;
