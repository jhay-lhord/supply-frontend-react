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
  purchase_request: string;
  rfq: string;
  item: string;
  unit_price: number;
  brand_model: string;
  is_low_price: boolean;
};
