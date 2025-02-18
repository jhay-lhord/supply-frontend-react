import Loading from "../../shared/components/Loading";
import { columns } from "./columns";
import { DataTable } from "./data-table";
import { usePurchaseRequestInProgress } from "@/services/purchaseRequestServices";

export default function PurchaseRequestInProgressDataTable() {
  const { purchaseRequestInProgress, isLoading } =
    usePurchaseRequestInProgress();

    const flattenInProgressData = purchaseRequestInProgress.map(data => ({
      ...data,
      name: data.requisitioner_details.name
    }))

  if (isLoading) return <Loading />;

  return (
    <>
      <div className="hidden w-full flex-col space-y-8 md:flex">
        <DataTable data={flattenInProgressData} columns={columns} />
      </div>
    </>
  );
}
