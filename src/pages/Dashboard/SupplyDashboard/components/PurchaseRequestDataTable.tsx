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

  if (isLoading) return <Loading/>

  if (error) return <div>{error.message}</div>;

  const purchaseRequestData: purchaseRequestType[] =
    data?.status === "success" ? data.data || [] : [];

  const sortedPurchaseRequestData = arraySort(purchaseRequestData, "pr_no")

  console.log(purchaseRequestData)
  const handleOpenDialog = () => {
    setIsDialogOpen(true);
  };

  const lastPrNo =
    sortedPurchaseRequestData?.length
      ? sortedPurchaseRequestData[sortedPurchaseRequestData.length - 1].pr_no
      : undefined;
  console.log(lastPrNo);

  return (
    <>
      <div className="hidden w-full flex-col space-y-8 p-8 md:flex">
        <Button
          className="px-6 bg-orange-200 w-40 flex-1 hover:bg-orange-300 hover:scale-110 ease-in-out transition duration-300 hover:ease-in text-black"
          onClick={handleOpenDialog}
        >
          <PlusIcon className="mr-2"></PlusIcon>ADD
        </Button>
        <PurchaseRequestForm
          isDialogOpen={isDialogOpen}
          setIsDialogOpen={setIsDialogOpen}
          lastPrNo={lastPrNo?.toString()}
        />
        <DataTable data={sortedPurchaseRequestData} columns={columns} />
      </div>
    </>
  );
}
