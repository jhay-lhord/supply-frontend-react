import { useAbstractOfQuotation } from "@/services/AbstractOfQuotationServices";
import { DataTable } from "./components/data-table";
import { po_columns } from "./components/po-columns";
import Layout from "./components/Layout/SupplyDashboardLayout";
import { useGetAllPurchaseOrder } from "@/services/puchaseOrderServices";
import { useMemo } from "react";

export default function SupplyAOQ() {
  const { data } = useAbstractOfQuotation();
  const { data: purchase_order } = useGetAllPurchaseOrder();
  console.log(purchase_order);
  const purchaseOrderData = Array.isArray(purchase_order?.data) ? purchase_order.data : [];
  
  const po_no = purchaseOrderData.filter(data => data.po_no).map(data => data.po_no )
  console.log(po_no)
  
  //render abstract that has not yet order placed
  const filteredAbstractData = useMemo(() => {
    const abstractData = Array.isArray(data?.data) ? data.data : []
    return abstractData.filter(data => !po_no.includes(data.aoq_no))
  }, [data?.data, po_no])

  return (
    <Layout>
      <div className="w-full flex-col space-y-8 md:flex">
        <DataTable data={filteredAbstractData!} columns={po_columns} />
      </div>
    </Layout>
  );
}
