import { Button } from "@/components/ui/button";
import { columns } from "./columns";
import { DataTable } from "./data-table";
import { GetPurchaseRequest } from "@/services/purchaseRequestServices";
import { purchaseRequestType } from "@/types/response/puchase-request";
import { useState, useEffect } from "react";
import { PlusIcon } from "@radix-ui/react-icons";
import AbstractOfQuotationForm from "./AbstractOfQuotationForm";


export default function AbstractOfQuotationDataTable() {
  const [AbstractOfQuotation, setAbstractOfQuotation] = useState<purchaseRequestType[]>(
    []
  );
  const [isDialogOpen, setIsDialogOpen] = useState<boolean>(false);

  const handleOpenDialog = () => {
    setIsDialogOpen(true);
  };



  useEffect(() => {
    const fetchPurchaseRequest = async () => {
      const response = await GetPurchaseRequest();



      if (response.status === "success") {
        const responseInArray = Array.isArray(response.data)
          ? response.data
          : [];
        setAbstractOfQuotation(responseInArray);
      }
    };
    fetchPurchaseRequest();
  }, []);


  return (
    <>
      <div className="hidden w-full flex-col space-y-8 p-8 md:flex">
        <Button className="px-6 bg-orange-200 w-40 flex-1 hover:bg-orange-300 hover:scale-110 ease-in-out transition duration-300 hover:ease-in text-black" onClick={handleOpenDialog}>
          <PlusIcon className="mr-2"></PlusIcon>Add
        </Button>
        <AbstractOfQuotationForm isDialogOpen={isDialogOpen} setIsDialogOpen={setIsDialogOpen} lastPrNo={lastPrNo}/>
        <DataTable data={AbstractOfQuotation} columns={columns} />
      </div>
    </>
  );
}
