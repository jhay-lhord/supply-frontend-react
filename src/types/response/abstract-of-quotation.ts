export type supplierType_ = {
  supplier_no: string;
  rfq_details: {
    purchase_request: string;
    rfq_no: string;
    supplier_name: string;
    supplier_address: string;
    tin: string;
    is_VAT: boolean;
  };
  aoq_details: {
    aoq_no: string;
    pr_details: {
      pr_no: string;
      requisitioner_details: {
        name: string;
      };
    };
  };
  is_added: boolean;
  extra_character: string;
  created_at: Date;
};

export type supplierItemType_ = {
  supplier_item_no: string;
  total_amount: string;
  remaining_quantity: number;
  old_delivered_quantity: number;
  item_quotation_details: {
    item_quotation_no: string;
    brand_model: string;
    is_low_price: boolean;
    unit_price: string;
    item_details: {
      item_no: string;
      stock_property_no: string;
      item_description: string;
      unit: string;
      quantity: string;
      unit_cost: string;
      total_cost: string;
    };
  };
  rfq_details: {
    rfq_no: string;
    supplier_name: string;
    supplier_address: string;
    tin: string;
    is_VAT: boolean;
    purchase_request: string;
  };
  supplier_details: {
    aoq_details: {
      aoq_no: string;
      pr_details: {
        pr_no: string;
        purpose: string;
        office: string;
        status: string;
        res_center_code: string;
        requisitioner_details: {
          name: string;
          department: string;
          designation: string;
        };
        created_at: Date;
      };
    };
    supplier_no: string;
  };
};

export type abstractType_ = {
  aoq_no: string;
  rfq_details: {
    is_VAT: boolean;
    purchase_request: string;
    rfq_no: string;
    supplier_address: string;
    supplier_name: string;
    tin: string;
  };
  pr_details: {
    pr_no: string;
    res_center_code: string;
    status: string;
    purpose: string;
    requested_by: string;
    approved_by: string;
    requisitioner_details: {
      name: string;
      department: string;
      designation: string;
    };
  };
  total_amount: string;
  created_at: Date;
};
