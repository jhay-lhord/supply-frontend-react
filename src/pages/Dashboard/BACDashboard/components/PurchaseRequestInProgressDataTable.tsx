import { useRequestForQoutation } from "@/services/requestForQoutationServices";
import Loading from "../../shared/components/Loading";
import { columns } from "./columns";
import { DataTable } from "./data-table";
import { usePurchaseRequestInProgress } from "@/services/purchaseRequestServices";
import { useMemo } from "react";

export default function PurchaseRequestInProgressDataTable() {
  const { purchaseRequestInProgress, isLoading } =
    usePurchaseRequestInProgress();
  const { data } = useRequestForQoutation();

  const dataHasRFQ = useMemo(() => {
    const data_ = Array.isArray(data?.data) ? data?.data : []
    const prNos = data_.map(data => data.purchase_request)

    return purchaseRequestInProgress.filter(data => prNos.includes(data.pr_no))
  }, [data?.data, purchaseRequestInProgress])

  if (isLoading) return <Loading />;

  return (
    <>
      <div className="hidden w-full flex-col space-y-8 p-4 md:flex">
        <DataTable data={dataHasRFQ} columns={columns} />
      </div>
    </>
  );
}
