import { useAbstractOfQuotation } from "@/services/AbstractOfQuotationServices";
import Loading from "../../shared/components/Loading";
import { DataTable } from "./data-table";
import { po_columns } from "./po-columns";

export default function PurchaseOrderDataTable() {
  const {data, isLoading} = useAbstractOfQuotation()

  if(isLoading) return <Loading/>

  const purchaseOrderData = Array.isArray(data?.data) ? data.data : []

  return (
    <>
      <div className="hidden w-full flex-col space-y-8 p-8 md:flex bg-slate-100 h-screen">
        <DataTable data={purchaseOrderData!} columns={po_columns} />
      </div>
    </>
  );
}
