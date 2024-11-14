import { usePurchaseRequestInProgress } from "@/services/purchaseRequestServices";
import { DataTable } from "./data-table";
import { AbstractColumn } from "./abstract-columns";
import Loading from "../../shared/components/Loading";

export default function AbstractOfQuotationDataTable() {
  const {purchaseRequestInProgress, isLoading} = usePurchaseRequestInProgress()
  console.log(purchaseRequestInProgress)

  if(isLoading) return <Loading/>

  return (
    <>
      <div className="hidden w-full flex-col space-y-8 md:flex">

        <DataTable data={purchaseRequestInProgress!} columns={AbstractColumn} />
      </div>
    </>
  );
}
