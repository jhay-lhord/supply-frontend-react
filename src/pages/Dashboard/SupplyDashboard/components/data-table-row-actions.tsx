import { useState } from "react";
import {
  TrashIcon,
  ArrowTopRightIcon,
  ArrowRightIcon,
} from "@radix-ui/react-icons";
import { Button } from "@/components/ui/button";
import { DeleteDialog } from "./DeleteDialog";
import {
  Tooltip,
  TooltipProvider,
  TooltipTrigger,
  TooltipContent,
} from "@/components/ui/tooltip";
import { deletePurchaseRequest } from "@/services/purchaseRequestServices";
import { purchaseRequestType } from "@/types/response/puchase-request";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useLocation, useNavigate } from "react-router-dom";
import { Separator } from "@/components/ui/separator";
import { toast } from "sonner";
import { PurchaseOrderForm } from "./PurchaseOrderForm";

interface DataTableRowActionsProps {
  aoq_no:string
  pr_no: string;
  _data: purchaseRequestType;
}

export const DataTableRowActions = ({
  aoq_no,
  _data,
  pr_no,
}: DataTableRowActionsProps) => {
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState<boolean>(false);
  const [isDialogOpen, setIsDialogOpen] = useState<boolean>(false);

  const location = useLocation();

  const purchaseRequestPath = "/supply/purchase-request";

  const queryClient = useQueryClient();
  const navigate = useNavigate();

  const deletePurchasePurchaseMutation = useMutation({
    mutationFn: deletePurchaseRequest,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["purchase-request"] });
      toast.success("Successfully Deleted!", {
        description: "The Purchase Request sucessfully deleted.",
      });
    },
  });

  const handleViewClick = (event: React.MouseEvent) => {
    event.stopPropagation();
    navigate(`/supply/purchase-request/${pr_no}`);
  };

  const handleOpenDialog = (event: React.MouseEvent) => {
    event.stopPropagation();
    setIsDeleteDialogOpen(true);
  };

  const handleDeletePurchaseRequest = async () => {
    const selectedPrNo = _data.pr_no;
    try {
      deletePurchasePurchaseMutation.mutate(selectedPrNo);
    } catch (error) {
      console.log(error);
    }
  };

  const handleOpenForm = () => {
    setIsDialogOpen(true);
  };

  return (
    <>
      {location.pathname === purchaseRequestPath ? (
        <TooltipProvider delayDuration={100} skipDelayDuration={200}>
          <div className="flex gap-4 ">
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  onClick={handleViewClick}
                  className=" px-2 bg-orange-200 data-[state=open]:bg-muted hover:rounded-full"
                >
                  <p className="mx-1">Open</p><ArrowTopRightIcon className="h-4 w-4" />
                  <span className="sr-only">Open</span>
                </Button>
              </TooltipTrigger>
              <TooltipContent side="top">Open</TooltipContent>
            </Tooltip>

            <Separator className="h-10" orientation="vertical" decorative />

            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  onClick={handleOpenDialog}
                  variant="outline"
                  className="flex data-[state=open]:bg-muted hover:rounded-full bg- hover:bg-red-400 hover:text-gray-100"
                >
                  <p className="mx-1">Delete</p><TrashIcon className="h-4 w-4" />
                  <span className="sr-only">Delete</span>
                </Button>
              </TooltipTrigger>
              <TooltipContent side="top">Delete</TooltipContent>
            </Tooltip>
          </div>
        </TooltipProvider>
      ) : (
        <>
         <Button className=" mx-2 gap-4" variant={"outline"} onClick={handleOpenForm}>
            <p className="px-2 text-base">View</p>
          </Button>
          <Button className="group" onClick={handleOpenForm}>
            <p className="px-2 text-base">Place Order</p>
            <ArrowRightIcon
              width={20}
              height={20}
              className="opacity-0 group-hover:opacity-100"
            />
          </Button>
        </>
      )}

      <DeleteDialog
        onDeleteClick={handleDeletePurchaseRequest}
        message="Purchase Request"
        isDialogOpen={isDeleteDialogOpen}
        setIsDialogOpen={setIsDeleteDialogOpen}
      />

      <PurchaseOrderForm
        aoq_no={aoq_no}
        pr_no={pr_no}
        isDialogOpen={isDialogOpen}
        setIsDialogOpen={setIsDialogOpen}
      />
    </>
  );
};
