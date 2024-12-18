export type quotationResponseType = {
  rfq_no: string;
  purchase_request: string;
  supplier_name: string;
  items: string;
  supplier_address: string;
  tin: string;
  is_VAT: boolean;
  created_at: Date;
};

export type itemQuotationResponseType = {
  item_quotation_no:string;
  purchase_request: string;
  rfq: string;
  item_details: {
    item_no: string,
    item_description: string;
    unit: string;
    quantity: string;
    unit_cost: string;
  };
  unit_price: number;   
  brand_model: string;
  is_low_price: boolean;
};
