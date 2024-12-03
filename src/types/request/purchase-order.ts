import { z } from "zod";

export const purchaseOrderSchema = z.object({
  po_no: z.string(),
  purchase_request: z.string(),
  request_for_quotation: z.string(),
  abstract_of_quotation: z.string(),
});

export type purchaseOrderItemType = {
  po_item_no: string;
  purchase_request: string;
  purchase_order: string;
  aoq_item: string;
};

export type purchaseOrderType = z.infer<typeof purchaseOrderSchema>;
