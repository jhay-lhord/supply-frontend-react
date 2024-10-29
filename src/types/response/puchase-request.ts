export type purchaseRequestType = {
  pr_no: string,
  user: string,
  item_no: string,
  res_center_code: string,
  purpose: string,
  status: string,
  requested_by?: string,
  approved_by?: string,
  created_at: Date,
}