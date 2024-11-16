export type itemSelectedType_ = {
  afq: string;
  item_quote_no: string;
  pr_details: {
    pr_no:string;
    res_center_code: string;
    status: string;
    requested_by: string;
    purpose:string;
    approved_by: string;
    created_at: Date;
  };
  item_details: {
    brand_model: string;
    is_low_price: string;
    item_details: {
      item_no: string
      unit: string;
      item_description: string;
      purchase_request: string;
      quantity: string;
      unit_cost: string;

    };
    item_quotation_no:string;
    purchase_request: string;
    rfq: string;
    unit_price: string;
  }
  rfq_details:{
    supplier_name: string;
    supplier_address: string;
    tin: string;
    is_VAT: string;
    rfq_no: string;
  };
  is_item_selected: boolean;
  total_amount: string;
  created_at: Date
}

export type abstractType_ = {
  afq_no: string,
  rfq_details: {
    is_VAT: boolean,
    purchase_request: string,
    rfq_no: string,
    supplier_address: string,
    supplier_name: string,
    tin:string,
  },
  pr_details: {
    pr_no: string,
    res_center_code: string,
    status: string,
    purpose: string,
    requested_by:string,
    approved_by: string,
  }
  created_at: Date
}