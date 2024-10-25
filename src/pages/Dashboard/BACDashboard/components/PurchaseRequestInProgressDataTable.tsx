import Loading from "../../shared/components/Loading";
import { columns } from "./columns";
import { DataTable } from "./data-table";
import { usePurchaseRequestInProgress } from "@/services/purchaseRequestServices";
import { purchaseRequestType } from "@/types/response/puchase-request";


export default function PurchaseRequestInProgressDataTable() {
  const {purchaseRequestInProgress, isLoading} = usePurchaseRequestInProgress()


  if (isLoading) return <Loading/>

  const purchaseRequestInProgressData: purchaseRequestType[] = Array.isArray(purchaseRequestInProgress) ? purchaseRequestInProgress : []
  return (
    <>
      <div className="hidden w-full flex-col space-y-8 p-8 md:flex">
        <DataTable data={purchaseRequestInProgressData} columns={columns} />
      </div>
    </>
  );
}
