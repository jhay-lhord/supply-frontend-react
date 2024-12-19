import { columns } from "./columns";
import { DataTable } from "./data-table";
import { usePurchaseRequest } from "@/services/purchaseRequestServices";
import { purchaseRequestType } from "@/types/response/puchase-request";
import Loading from "../../shared/components/Loading";
import { arraySort } from "@/services/itemServices";

export default function PurchaseRequestDataTable() {
  const { isLoading, error, data } = usePurchaseRequest();

  if (isLoading) return <Loading />;

  if (error) return <div>{error.message}</div>;

  const purchaseRequestData: purchaseRequestType[] =
    data?.status === "success" ? data.data || [] : [];

  const sortedPurchaseRequestData = arraySort(purchaseRequestData, "pr_no");

  const flattenedPurchaseData = sortedPurchaseRequestData.map(purchase_request => ({
    ...purchase_request,
    name: purchase_request.requisitioner_details.name,
    designation: purchase_request.requisitioner_details.designation,
    department: purchase_request.requisitioner_details.department
  }))


  return (
    <>
      <div className="hidden w-full flex-col md:flex">
        <DataTable data={flattenedPurchaseData} columns={columns} />
      </div>
    </>
  );
}
