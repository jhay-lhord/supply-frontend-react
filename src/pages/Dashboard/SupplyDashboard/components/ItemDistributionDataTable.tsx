import { DataTable } from "./data-table";
import { usePurchaseRequest } from "@/services/purchaseRequestServices";
import { purchaseRequestType } from "@/types/response/puchase-request";
import Loading from "../../shared/components/Loading";
import { arraySort } from "@/services/itemServices";
import { itemDistributionColumns } from "./item-distribution-column";

export const ItemDistributionDataTable = () => {
  const { isLoading, error, data } = usePurchaseRequest();

  if (isLoading) return <Loading />;

  if (error) return <div>{error.message}</div>;

  const purchaseRequestData: purchaseRequestType[] =
    data?.status === "success" ? data.data || [] : [];

  const purchaseRequestCompleted = purchaseRequestData.filter(data => data.status === "Completed")

  const sortedPurchaseRequestData = arraySort(purchaseRequestCompleted, "pr_no");

  const flattenedPurchaseData = sortedPurchaseRequestData.map(purchase_request => ({
    ...purchase_request,
    name: purchase_request.requisitioner_details.name,
    designation: purchase_request.requisitioner_details.designation,
    department: purchase_request.requisitioner_details.department
  }))

  console.log(flattenedPurchaseData)


  return (
    <>
      <div className="hidden w-full flex-col md:flex">
        <DataTable data={flattenedPurchaseData} columns={itemDistributionColumns} />
      </div>
    </>
  );
}
