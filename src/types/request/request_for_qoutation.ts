import { z } from "zod";

export const itemQuotationSchema = z.object({
  items: z.array(
    z.object({
      item_quotation_no: z.string(),
      purchase_request: z.string(),
      rfq: z.string().min(1, "Required"),
      item: z.string().min(1, "Required"),
      unit_price: z.number().min(1, "Must be atleast 1"),
      brand_model: z.string().min(1, "Required"),
      is_low_price: z.boolean()
    })
  ),
});
export const quotationSchema = z.object({
  rfq_no: z.string().min(1, "Required"),
  purchase_request: z.string().min(1, "Required"),
  supplier_name: z.string().min(1, "Required"),
  supplier_address: z.string().min(1, "Required"),
  tin: z.string().min(1, "Required"),
  is_VAT: z.boolean(),
});

export type itemQuotationRequestType = {
  item_quotation_no:string;
  purchase_request: string;
  rfq: string;
  item: string;
  unit_price: number;   
  brand_model: string;
  is_low_price: boolean;
}

export const requestForQoutationSchema = z.intersection(quotationSchema, itemQuotationSchema)

export type itemQuotationType = z.infer<typeof itemQuotationSchema>;
export type requestForQoutationType = z.infer<typeof requestForQoutationSchema>;
export type qoutationType = z.infer<typeof quotationSchema>
