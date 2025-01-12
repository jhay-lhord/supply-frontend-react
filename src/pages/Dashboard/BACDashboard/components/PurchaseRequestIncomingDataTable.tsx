import Loading from "../../shared/components/Loading";
import { DataTable } from "./data-table";
import { usePurchaseRequestIncoming } from "@/services/purchaseRequestServices";
import { incoming_columns } from "./incoming-column";

export default function PurchaseRequestIncomingDataTable() {
  const { purchaseRequestIncoming, isLoading } = usePurchaseRequestIncoming();

  const flattenIncomingData = purchaseRequestIncoming.map((data) => ({
    ...data,
    name: data.requisitioner_details.name,
  }));

  console.log(flattenIncomingData);

  if (isLoading) return <Loading />;

  return (
    <>
      <div className="hidden w-full flex-col space-y-8 md:flex">
        <DataTable data={flattenIncomingData} columns={incoming_columns} />
      </div>
    </>
  );
}
