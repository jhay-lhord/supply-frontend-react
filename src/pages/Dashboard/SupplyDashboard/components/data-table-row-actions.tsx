import { useState } from "react";
import { DotsHorizontalIcon } from "@radix-ui/react-icons";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuShortcut,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
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
import { Sheet, SheetContent } from "@/components/ui/sheet";
import { deletePurchaseRequest } from "@/services/purchaseRequestServices";
import { purchaseRequestType } from "@/types/response/puchase-request";
import ItemForm from "./ItemForm";
import { useItem } from "@/services/itemServices";
import { itemType } from "@/types/response/item";
import { useMutation, useQueryClient } from "@tanstack/react-query";

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
  const [isDropdownOpen, setIsDropdownOpen] = useState<boolean>(false);
  const [isItemDialogOpen, setIsItemDialogOpen] = useState<boolean>(false);
  const [prNo, setPrNo] = useState<string | undefined>("");

  const queryClient = useQueryClient();

  const deletePurchasePurchaseMutation = useMutation({
    mutationFn: deletePurchaseRequest,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["purchase-request"] });
    },
  });

  const { isLoading, error, data } = useItem();

  if (isLoading) return <div>Loading ...</div>;

  if (error) return <div>Error Occured: {error.message}</div>;


  const handleViewItemsClick = () => {
    setIsSheetOpen(true);
    setIsDropdownOpen(false);
  };

  const handleAddItemsClick = () => {
    console.log(`The Pr No: ${pr_no}`);
    setIsItemDialogOpen(true);
    setIsDropdownOpen(false);
    setPrNo(pr_no);
    console.log(`Final Pr Number: ${prNo}`);
  };

  const handleOpenDialog = () => {
    setIsDialogOpen(true);
    setIsDropdownOpen(false);
  };

  const handleDeletePurchaseRequest = async () => {
    const selectedPrNo = _data.pr_no;
    try {
      deletePurchasePurchaseMutation.mutate(selectedPrNo)
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <>
      <DropdownMenu open={isDropdownOpen} onOpenChange={setIsDropdownOpen}>
        <DropdownMenuTrigger asChild>
          <Button
            variant="ghost"
            className="flex h-8 w-8 p-0 data-[state=open]:bg-muted"
          >
            <DotsHorizontalIcon className="h-4 w-4" />
            <span className="sr-only">Open menu</span>
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-[160px]">
          <DropdownMenuItem onClick={handleViewItemsClick}>
            View Items
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem onClick={handleAddItemsClick}>
            Add Items
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem>Edit</DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem onClick={handleOpenDialog}>
            Delete
            <DropdownMenuShortcut>⌘⌫</DropdownMenuShortcut>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

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
