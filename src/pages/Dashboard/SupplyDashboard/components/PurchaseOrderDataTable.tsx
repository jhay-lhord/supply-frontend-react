import Loading from "../../shared/components/Loading";
import { columns } from "./columns";
import { DataTable } from "./data-table";
import { useGetPurchaseOrder } from "@/services/puchaseOrderServices";

export default function PurchaseOrderDataTable() {
  const {purchase_order, isLoading} = useGetPurchaseOrder()

  if(isLoading) return <Loading/>

  const purchaseOrderData = Array.isArray(purchase_order) ? purchase_order : []

  return (
    <>
      <div className="hidden w-full flex-col space-y-8 p-8 md:flex bg-slate-100 h-screen">
        <DataTable data={purchaseOrderData} columns={columns} />
      </div>
    </>
  );
}
