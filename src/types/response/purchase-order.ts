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