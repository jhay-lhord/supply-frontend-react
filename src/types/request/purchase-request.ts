import { z } from 'zod';

export const purchaseRequestFormSchema = z.object({
  pr_no: z.string().min(1, 'Required'),
  res_center_code: z.string().min(1, 'Required'),
  purpose: z.string().min(1, 'Required'),
  status: z.string().min(1, 'Required').default("Not Approved"),
  requested_by: z.string().min(1, 'Required'),
  approved_by: z.string().min(1, 'Required'),
});

export type PurchaseRequestData = z.infer<typeof purchaseRequestFormSchema>;


export const EditPRFormSchema = z.object({
  res_center_code: z.string().min(1, 'Required'),
  purpose: z.string().min(1, 'Required'),
  requested_by: z.string().min(1, 'Required'),
});

export type EditPRFormType = z.infer<typeof EditPRFormSchema>;
