import { z } from "zod";

export const purchaseOrderSchema = z.object({
  po_no: z.string(),
  total_amount: z.number(),
  purchase_request: z.string(),
  request_for_quotation: z.string(),
  abstract_of_quotation: z.string(),
  supplier: z.string(),
});

export type purchaseOrderItemType = {
  po_item_no: string;
  purchase_request: string;
  purchase_order: string;
  supplier_item: string;
};

export type purchaseOrderType = z.infer<typeof purchaseOrderSchema>;

export const supplierSchema = z.object({
  supplier_no: z.string(),
  rfq_details: z.object({
    purchase_request: z.string(),
    rfq_no: z.string(),
    supplier_name: z.string(),
    supplier_address: z.string(),
    tin: z.string(),
    is_VAT: z.boolean(),
  }),
  aoq_details: z.object({
    aoq_no: z.string(),
    pr_details: z.object({
      pr_no: z.string(),
      requisitioner_details: z.object({
        name: z.string(),
      }),
    }),
  }),
  created_at: z.date(),
});

export const supplierItemSchema = z.object({
  supplier_item_no: z.string(),
  total_amount: z.string(),
  remaining_quantity: z.number(),
  old_delivered_quantity: z.number().default(0),
  item_quotation_details: z.object({
    item_quotation_no: z.string(),
    brand_model: z.string(),
    is_low_price: z.boolean(),
    unit_price: z.string(),
    item_details: z.object({
      item_no: z.string(),
      stock_property_no: z.string(),
      item_description: z.string(),
      unit: z.string(),
      quantity: z.string(),
      unit_cost: z.string(),
      total_cost: z.string(),
    }),
  }),
  rfq_details: z.object({
    rfq_no: z.string(),
    supplier_name: z.string(),
    supplier_address: z.string(),
    tin: z.string(),
    is_VAT: z.boolean(),
    purchase_request: z.string(),
  }),
  supplier_details: z.object({
    aoq_details: z.object({
      aoq_no: z.string(),
      pr_details: z.object({
        pr_no: z.string(),
      }),
    }),
    supplier_no: z.string(),
  }),
  quantity_delivered: z.number().min(0).optional(),
});

export type SupplierType = z.infer<typeof supplierSchema>;
export type SupplierItemType = z.infer<typeof supplierItemSchema>;

export const formSchema = z.object({
  items: z.array(supplierItemSchema),
});

export const deliveredFormSchema = z.object({
  items: z.array(supplierItemSchema),
});

export type DeliveredFormType = z.infer<typeof deliveredFormSchema>;

export const inspectionSchema = z.object({
  inspection_no: z.string(),
  purchase_request: z.string(),
  purchase_order: z.string(),
});

export type inspectionType = z.infer<typeof inspectionSchema>;

export const itemsDeliveredSchema = z.object({
  purchase_request: z.string(),
  inspection: z.string(),
  supplier_item: z.string(),
  quantity_delivered: z.number().min(0).optional(),
  is_complete: z.boolean(),
});

export type itemsDeliveredType = z.infer<typeof itemsDeliveredSchema>;

export type _itemsDeliveredType = {
  id: number;
  pr_details: {
    pr_no: string;
    res_center_code: string;
    office: string;
    purpose: string;
    status: string;
    requisitioner_details: {
      name: string;
      department: string;
      designation: string;
    };
    created_at: Date;
  };
  inspection_details: {
    created_at: Date
    po_details: {
      po_no: string;
      status: string;
      total_amount: string;
      po_details: {
        po_no: string;
      };
      pr_details: {
        pr_no: string;
        res_center_code: string;
        office: string;
        purpose: string;
        requisitioner_details: {
          name: string;
          department: string;
          designation: string;
        };
        created_at: Date;
      };
      rfq_details: {
        supplier_name: string
        address: string
        tin: string
        is_VAT: boolean
      }
    };
  };
  item_details: {
    item_quantity: string
    item_cost: string
    item_quotation_details: {
      item_details: {
        stock_property_no: string;
        item_description: string;
        quantity: string;
        unit: string;
        unit_cost: string;
      };
      unit_price: string;
      brand_model: string;
    };
    supplier_item_no: string;
  };
  quantity_delivered: number;
  supplier_item: string;
  created_at: Date;
  date_received: Date;
  is_complete: boolean;
  is_partial: boolean;
};

export type StockItemType = Omit<itemsDeliveredType, "id">;
