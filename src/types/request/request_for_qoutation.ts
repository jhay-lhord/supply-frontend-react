import { z } from 'zod';

export const itemSchema = z.object({
  item: z.string().min(1, "Required"),
  unit_price: z.string().min(1, "Required"),
  brand_model: z.string().min(1, "Required"),
})
export const requestForQoutationSchema = z.object({
  rfq_no: z.string().min(1, 'Required'),
  rfq_count: z.string().min(1, 'Required'),
  purchase_request: z.string().min(1, "Required"),
  items: z.array(itemSchema),
  supplier_name: z.string().min(1, "Required"),
  supplier_address: z.string().min(1, "Required"),
  tin: z.string().min(1, "Required")
});
export type requestForQoutationItemType = z.infer<typeof itemSchema>
export type requestForQoutationType = z.infer<typeof requestForQoutationSchema>;

export const requestForQuotationItemDataSchema = z.object({
  rfq_no: z.string(),
  rfq_count: z.string().min(1, 'Required'),
  purchase_request: z.string(),
  supplier_name: z.string(),
  supplier_address: z.string(),
  tin: z.string(),
  item: z.string(),
  unit_price: z.string(),
  brand_model: z.string(),
})

export type requestForQuotationItemDataType = z.infer<typeof requestForQuotationItemDataSchema>
