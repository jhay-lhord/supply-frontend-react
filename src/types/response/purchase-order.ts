export type purchaseOrdertype_ = {
  po_no: string,
  status: string,
  pr_details: {
    pr_no:string
  }
  rfq_details: {
    rfq_no: string
  },
  aoq_details: {
    aoq_no: string
  },
  total_amount: string
  created_at: Date;
  updated_at:Date;  
}