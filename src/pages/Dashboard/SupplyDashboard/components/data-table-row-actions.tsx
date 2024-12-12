import { useState } from "react";
import { ArrowTopRightIcon } from "@radix-ui/react-icons";
import { Button } from "@/components/ui/button";
import { DeleteDialog } from "./DeleteDialog";
import {
  Tooltip,
  TooltipProvider,
  TooltipTrigger,
  TooltipContent,
} from "@/components/ui/tooltip";
import { deletePurchaseRequest, usePurchaseRequestActions } from "@/services/purchaseRequestServices";
import { purchaseRequestType } from "@/types/response/puchase-request";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import { Separator } from "@/components/ui/separator";
import { toast } from "sonner";
import { Loader2, MoveRightIcon } from "lucide-react";

interface DataTableRowActionsProps {
  pr_no: string;
  _data: purchaseRequestType;
}

export const DataTableRowActions = ({
  _data,
  pr_no,
}: DataTableRowActionsProps) => {
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState<boolean>(false);

  const queryClient = useQueryClient();
  const navigate = useNavigate();
  const { handleForward, isPendingForward} = usePurchaseRequestActions()

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


  const handleDeletePurchaseRequest = async () => {
    const selectedPrNo = _data.pr_no;
    try {
      deletePurchasePurchaseMutation.mutate(selectedPrNo);
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <>
      <TooltipProvider delayDuration={100} skipDelayDuration={200}>
        <div className="flex gap-4 ">
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                onClick={handleViewClick}
                className=" px-2 bg-orange-200 data-[state=open]:bg-muted hover:rounded-full"
              >
                <p className="mx-1 text-sm font-thin">Open</p>
                <ArrowTopRightIcon className="h-4 w-4" />
                <span className="sr-only">Open</span>
              </Button>
            </TooltipTrigger>
            <TooltipContent side="top">Open</TooltipContent>
          </Tooltip>

          {_data.status === "Approved" && (
            <>
              <Separator className="h-10" orientation="vertical" decorative />

              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    onClick={() => handleForward(pr_no)}
                    variant="outline"
                    className="flex data-[state=open]:bg-muted hover:rounded-full bg- hover:bg-green-300 hover:border-none text-gray-950"
                  >
                    <p className="mx-1 text-sm font-thin">{isPendingForward ? <Loader2 className="animate-spin"/>: "Forward"}</p>
                    <MoveRightIcon className="h-4 w-4" />
                    <span className="sr-only">Delete</span>
                  </Button>
                </TooltipTrigger>
                <TooltipContent side="top">
                  Forward to Procurement
                </TooltipContent>
              </Tooltip>
            </>
          )}
        </div>
      </TooltipProvider>

      <DeleteDialog
        onDeleteClick={handleDeletePurchaseRequest}
        message="Purchase Request"
        isDialogOpen={isDeleteDialogOpen}
        setIsDialogOpen={setIsDeleteDialogOpen}
      />
    </>
  );
};
