import { z } from "zod";

export const purchaseOrderSchema = z.object({
  po_no: z.string(),
  total_amount: z.number(),
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

const itemSchema = z.object({
  aoq: z.string(),
  item_selected_no: z.string(),
  pr_details: z.object({
    pr_no: z.string(),
    res_center_code: z.string(),
    status: z.string(),
    requisitioner: z.string(),
    purpose: z.string(),
    campus_director: z.string(),
  }),
  item_qoutation_details: z.object({
    brand_model: z.string(),
    is_low_price: z.boolean(),
    item_details: z.object({
      item_no: z.string(),
      unit: z.string(),
      item_description: z.string(),
      purchase_request: z.string(),
      quantity: z.string(),
      unit_cost: z.string(),
    }),
    item_quotation_no: z.string(),
    purchase_request: z.string(),
    rfq: z.string(),
    unit_price: z.string(),
  }),
  rfq_details: z.object({
    supplier_name: z.string(),
    supplier_address: z.string(),
    tin: z.string(),
    is_VAT: z.boolean(),
    rfq_no: z.string(),
  }),
  is_item_selected: z.boolean(),
  total_amount: z.string(),
  quantity_delivered: z.number().min(0).optional(),
})  

export const deliveredSchema = z.object({
  items: z.array(itemSchema),
})

export type deliveredType = z.infer<typeof deliveredSchema>

export const inspectionSchema = z.object({
  inspection_no: z.string(),
  purchase_request: z.string(),
  purchase_order: z.string()
})

export type inspectionType = z.infer<typeof inspectionSchema>

export const itemsDeliveredSchema = z.object({
  inspection: z.string(),
  items: z.string(),
  quantity_delivered: z.number().min(0).optional(),
})

export type itemsDeliveredType = z.infer<typeof itemsDeliveredSchema>

export type _itemsDeliveredType = {
  inspection_details: {
    po_details: {
      po_no: string
      status: string
      total_amount: string
    }
  }
  item_details: {
    item_qoutation_details: {
      item_details: {
        item_description: string
        quantity: string
        unit: string
        unit_cost:string
      }
      unit_price: string
    }
  }
  quantity_delivered: string
}