import { z } from 'zod';

export const purchaseRequestFormSchema = z.object({
  pr_no: z.string().min(1, 'Required'),
  office: z.string().min(1, 'Required'),
  fund_cluster: z.string().optional(),
  purpose: z.string().min(1, 'Required'),
  status: z.string().min(1, 'Required').default("Not Approved"),
  mode_of_procurement: z.string().default("Direct Contracting"),
  requisitioner: z.string().min(1, 'Required'),
  campus_director: z.string().min(1, 'Required'),
});

export type PurchaseRequestData = z.infer<typeof purchaseRequestFormSchema>;


export const EditPRFormSchema = z.object({
  office: z.string().min(1, 'Required'),
  purpose: z.string().min(1, 'Required'),
  requisitioner: z.string().min(1, 'Required'),
});

export type EditPRFormType = z.infer<typeof EditPRFormSchema>;
