import { z } from "zod";

export const itemSelectedSchema = z.object({
  items: z.array(
    z.object({
      item_quote_no: z.string(),
      afq: z.string(),
      purchase_request: z.string(),
      rfq: z.string(),
      item_q: z.string(),
      is_item_selected: z.boolean(),
      total_amount: z.string(),
    })
  )
})

export const abstractSchema = z.object({
  afq_no: z.string(),
  rfq: z.string(),
  purchase_request: z.string()
})

export type itemSelectedQuoteType = {
  item_quote_no: string,
      afq: string,
      purchase_request: string,
      rfq: string,
      item_q: string,
      is_item_selected: boolean,
      total_amount: string,
}

export const abstractOfQuotationSchema = z.intersection(abstractSchema, itemSelectedSchema)

export type abstractOfQuotationType = z.infer<typeof abstractOfQuotationSchema>
export type itemSelectedType = z.infer<typeof itemSelectedSchema>
export type abstractType = z.infer<typeof abstractSchema>