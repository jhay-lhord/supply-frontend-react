export type purchaseOrdertype_ = {
  po_no: string,
  status: string,
  pr_details: {
    pr_no:string
    mode_of_procurement: string
  }
  rfq_details: {
    rfq_no: string
    supplier_name: string
    supplier_address: string
    is_VAT: string
    tin: string
  }
  aoq_details: {
    aoq_no: string
  }
  supplier_details: {
    supplier_no: string
  }
  total_amount: string
  created_at: Date;
  updated_at:Date;  
}

export type purchaseOrderItemType_  = {
  created_at: Date
  po_item_no: string
  po_details: {
    po_no: string
  }
  pr_details: {
    mode_of_procurement: string
  }
  supplier_item_details: {
    item_cost: string
    item_quantity: string
    item_quotation_details: {
      brand_model: string
      is_low_price: boolean
      item_details: {
        item_description: string
        unit: string
        quantity: string
        stock_property_no: string
        total_cost: string
        unit_cost: string
      }
    }
    rfq_details: {
      rfq_no: string
      supplier_name: string
      supplier_address: string
      tin: string
      is_VAT: boolean
    }
  }
}