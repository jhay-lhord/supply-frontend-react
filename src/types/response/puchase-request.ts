export type purchaseRequestType = {
  pr_no: string,
  user: string,
  item_no: string,
  res_center_code: string,
  purpose: string,
  status: string,
  requisitioner_details: {
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