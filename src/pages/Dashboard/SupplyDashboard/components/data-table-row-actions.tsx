import { useState } from "react";
import {TrashIcon, PlusIcon, ArrowTopRightIcon } from "@radix-ui/react-icons";
import { Button } from "@/components/ui/button";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import {
  Tooltip,
  TooltipProvider,
  TooltipTrigger,
  TooltipContent,
} from "@/components/ui/tooltip";
import { Sheet, SheetContent } from "@/components/ui/sheet";
import { deletePurchaseRequest } from "@/services/purchaseRequestServices";
import { purchaseRequestType } from "@/types/response/puchase-request";
import ItemForm from "./ItemForm";
import { useItem } from "@/services/itemServices";
import { itemType } from "@/types/response/item";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import { Separator } from "@/components/ui/separator";

interface DataTableRowActionsProps {
  pr_no: string;
  _data: purchaseRequestType;
}

export const DataTableRowActions = ({
  _data,
  pr_no,
}: DataTableRowActionsProps) => {
  const [isSheetOpen, setIsSheetOpen] = useState<boolean>(false);
  const [isDialogOpen, setIsDialogOpen] = useState<boolean>(false);
  const [isItemDialogOpen, setIsItemDialogOpen] = useState<boolean>(false);
  const [prNo, setPrNo] = useState<string | undefined>("");

  const queryClient = useQueryClient();
  const navigate = useNavigate();

  const deletePurchasePurchaseMutation = useMutation({
    mutationFn: deletePurchaseRequest,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["purchase-request"] });
    },
  });

  const { isLoading, error, data } = useItem();

  if (isLoading) return <div>Loading ...</div>;

  if (error) return <div>Error Occured: {error.message}</div>;

  const handleViewClick = (event: React.MouseEvent) => {
    event.stopPropagation();
    navigate(`/purchase-request/${pr_no}`);
  };

  const handleAddItemsClick = (event: React.MouseEvent) => {
    event.stopPropagation();
    console.log(`The Pr No: ${pr_no}`);
    setIsItemDialogOpen(true);
    setPrNo(pr_no);
    console.log(`Final Pr Number: ${prNo}`);
  };

  const handleOpenDialog = (event: React.MouseEvent) => {
    event.stopPropagation();
    setIsDialogOpen(true);
  };

  const handleDeletePurchaseRequest = async (event: React.MouseEvent) => {
    event.stopPropagation();
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
                variant="ghost"
                className="flex h-8 w-8 p-0 data-[state=open]:bg-muted hover:rounded-full"
              >
                <ArrowTopRightIcon className="h-4 w-4 text-orange-400" />
                <span className="sr-only">Open</span>
              </Button>
            </TooltipTrigger>
            <TooltipContent side="top">Open</TooltipContent>
          </Tooltip>

          <Separator className="h-8" orientation="vertical" decorative/>

          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                onClick={handleAddItemsClick}
                variant="ghost"
                className="flex h-8 w-8 p-0 data-[state=open]:bg-muted hover:rounded-full"
              >
                <PlusIcon className="h-4 w-4 text-orange-400" />
                <span className="sr-only">Add Item</span>
              </Button>
            </TooltipTrigger>
            <TooltipContent side="top">Add Item</TooltipContent>
          </Tooltip>

          <Separator className="h-8" orientation="vertical"/>

          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                onClick={handleOpenDialog}
                variant="ghost"
                className="flex h-8 w-8 p-0 data-[state=open]:bg-muted hover:rounded-full text-orange-400 hover:bg-red-400 hover:text-gray-100"
              >
                <TrashIcon className="h-4 w-4" />
                <span className="sr-only">Delete</span>
              </Button>
            </TooltipTrigger>
            <TooltipContent side="top">Delete</TooltipContent>
          </Tooltip>
        </div>
      </TooltipProvider>

      <Sheet open={isSheetOpen} onOpenChange={setIsSheetOpen}>
        <SheetContent className="w-[60rem] ">
          <h1 className="text-2xl my-5">Items</h1>
          <p>
            <span className="font-bold">PR number:</span> {_data?.pr_no}
          </p>
          {data &&
            data.data
              ?.filter(
                (item: itemType) => item.purchase_request === _data.pr_no
              )
              .map((item) => <p key={item.item_no}>{item.item_description}</p>)}
        </SheetContent>
      </Sheet>

      <AlertDialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete
              Purchase Request
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel className="border-none outline-none bg-slate-300 hover:bg-slate-400">
              Cancel
            </AlertDialogCancel>
            <AlertDialogAction
              className="bg-red-400 hover:bg-red-500"
              onClick={handleDeletePurchaseRequest}
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      <ItemForm
        isItemDialogOpen={isItemDialogOpen}
        setIsItemDialogOpen={setIsItemDialogOpen}
        pr_no={prNo!}
      />
    </>
  );
};
