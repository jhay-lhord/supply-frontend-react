export type purchaseRequestType = {
  pr_no: string,
  user: string,
  item_no: string,
  office: string,
  fund_cluster: string,
  purpose: string,
  status: string,
  requisitioner_details: {
    requisition_id: string
    name: string
    designation: string
    department: string;
  },
  campus_director_details: {
    name: string
    designation: string
    department: string;
  },
  created_at: Date,
}