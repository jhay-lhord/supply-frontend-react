import { Button } from "@/components/ui/button";
import { columns } from "./columns";
import { DataTable } from "./data-table";
import { usePurchaseRequest } from "@/services/purchaseRequestServices";
import { purchaseRequestType } from "@/types/response/puchase-request";
import { useState } from "react";
import { PlusIcon } from "@radix-ui/react-icons";
import PurchaseRequestForm from "./PurchaseRequestForm";
import Loading from "../../shared/components/Loading";
import { arraySort } from "@/services/itemServices";

export default function PurchaseRequestDataTable() {
  const { isLoading, error, data } = usePurchaseRequest();
  const [isDialogOpen, setIsDialogOpen] = useState<boolean>(false);

  if (isLoading) return <Loading />;

  if (error) return <div>{error.message}</div>;

  const purchaseRequestData: purchaseRequestType[] =
    data?.status === "success" ? data.data || [] : [];

  const sortedPurchaseRequestData = arraySort(purchaseRequestData, "pr_no");

  const flattenedPurchaseData = sortedPurchaseRequestData.map(purchase_request => ({
    ...purchase_request,
    name: purchase_request.requisitioner_details.name,
    designation: purchase_request.requisitioner_details.designation,
    department: purchase_request.requisitioner_details.department
  }))

  const handleOpenDialog = () => {
    setIsDialogOpen(true);
  };

  const lastPrNo = sortedPurchaseRequestData?.length
    ? sortedPurchaseRequestData[sortedPurchaseRequestData.length - 1].pr_no
    : undefined;
  console.log(lastPrNo);

  return (
    <>
      <div className="hidden w-full flex-col md:flex p-6">
        <div>
          <Button
            className="mb-4 hover:bg-orange-300 text-black"
            onClick={handleOpenDialog}
          >
            <PlusIcon className="mr-2"/> Add Purchase Request
          </Button>
        </div>
        <PurchaseRequestForm
          isDialogOpen={isDialogOpen}
          setIsDialogOpen={setIsDialogOpen}
          lastPrNo={lastPrNo?.toString()}
        />
        <DataTable data={flattenedPurchaseData} columns={columns} />
      </div>
    </>
  );
}
