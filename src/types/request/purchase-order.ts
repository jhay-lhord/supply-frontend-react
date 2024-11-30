import { z } from "zod"

export const purchaseOrderSchema = z.object({
  po_no: z.string(),
  purchase_request: z.string(),
  request_for_quotation: z.string(),
  total_amount: z.string()
})

export type purchaseOrderType = z.infer<typeof purchaseOrderSchema>
