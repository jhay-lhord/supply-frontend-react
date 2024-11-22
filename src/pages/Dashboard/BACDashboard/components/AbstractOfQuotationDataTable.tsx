import { usePurchaseRequestInProgress } from "@/services/purchaseRequestServices";
import { DataTable } from "./data-table";
import { AbstractColumn } from "./abstract-columns";
import Loading from "../../shared/components/Loading";
import { useRequestForQoutation } from "@/services/requestForQoutationServices";
import { useMemo } from "react";

export default function AbstractOfQuotationDataTable() {
  const {purchaseRequestInProgress, isLoading} = usePurchaseRequestInProgress()
  const { data } = useRequestForQoutation();

  const dataHasRFQ = useMemo(() => {
    const data_ = Array.isArray(data?.data) ? data?.data : []
    const prNos = data_.map(data => data.purchase_request)

    return purchaseRequestInProgress.filter(data => prNos.includes(data.pr_no))
  }, [data?.data, purchaseRequestInProgress])
  if(isLoading) return <Loading/>

  return (
    <>
      <div className="hidden w-full flex-col space-y-8 md:flex">

        <DataTable data={dataHasRFQ!} columns={AbstractColumn} />
      </div>
    </>
  );
}
