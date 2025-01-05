import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Package, Loader2, AlertCircle } from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import {
  addInspectionReport,
  useAddItemsDelivered,
  useUpdatePurchaseOrderStatus,
} from "@/services/puchaseOrderServices";

import { useMemo, useState } from "react";
import { v4 as uuidv4 } from "uuid";
import { SupplierItemType } from "@/types/request/purchase-order";
import { AxiosError } from "axios";
import { MessageDialog } from "../../shared/components/MessageDialog";
import { useUpdatePurchaseRequestStatus } from "@/services/purchaseRequestServices";

interface OrderReceivedDialogProps {
  po_no: string;
  supplier_no: string;
  isDialogOpen: boolean;
  setIsDialogOpen: (open: boolean) => void;
  items_: SupplierItemType[];
}

interface messageDialogProps {
  open: boolean;
  message: string;
  title: string;
  type: "success" | "error" | "info";
}

export function OrderReceivedDialog({
  po_no,
  supplier_no,
  items_,
  isDialogOpen,
  setIsDialogOpen,
}: OrderReceivedDialogProps) {
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [messageDialog, setMessageDialog] = useState<messageDialogProps>({
    open: false,
    message: "",
    title: "",
    type: "success",
  });

  const { mutate: updatePOStatusMutation } = useUpdatePurchaseOrderStatus();
  const { mutate: updatePRStatusMutation } = useUpdatePurchaseRequestStatus();

  const { mutate: addItemsDeliveredMutation } = useAddItemsDelivered();

  const filteredItems = useMemo(() => {
    if (isDialogOpen)
      return items_.filter(
        (item) => item.supplier_details.supplier_no === supplier_no
      );
  }, [items_, supplier_no, isDialogOpen]);
  console.log(filteredItems);

  const pr_no = useMemo(() => {
    if (isDialogOpen)
      return filteredItems && filteredItems[0].rfq_details.purchase_request;
  }, [filteredItems, isDialogOpen]);

  const handleOrderReceived = async () => {
    setIsLoading(true);
    const inspectionData = {
      inspection_no: uuidv4(),
      purchase_request: pr_no ?? "",
      purchase_order: po_no,
    };

    try {
      const inspectionResponse = await addInspectionReport(inspectionData);
      const inspectionNo = inspectionResponse.data?.inspection_no;

      filteredItems?.map(async (data) => {
        const deliverData = {
          purchase_request: pr_no ?? "",
          supplier_item: data.supplier_item_no,
          quantity_delivered: Number(
            data.item_quotation_details.item_details.quantity
          ),
          is_complete: true,
          inspection: inspectionNo!,
        };

        await addItemsDeliveredMutation(deliverData);
      });

      await updatePOStatusMutation({
        po_no: po_no,
        status: "Completed",
      });
      await updatePRStatusMutation({
        pr_no: pr_no ?? "",
        status: "Ready for Distribution",
      });
      setIsLoading(false);
      setIsDialogOpen(false);
      setMessageDialog({
        open: true,
        message: "Order has been successfully received",
        title: "Order Received",
        type: "success",
      });
    } catch (error) {
      setMessageDialog({
        open: true,
        message:
          (error as AxiosError).message ??
          "Somthing went wrong, please try again later",
        title: "Error",
        type: "error",
      });
    }

    setIsDialogOpen(false);
  };

  return (
    <>
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="max-w-4xl">
          <DialogHeader>
            <DialogTitle className="text-2xl font-bold">
              To Recieve Items
            </DialogTitle>
            <p>{po_no}</p>
          </DialogHeader>
          {items_.length === 0 ? (
            <Alert>
              <AlertCircle className="h-4 w-4" />
              <AlertTitle>No To Recieve Items</AlertTitle>
              <AlertDescription>
                All items in this order have been fully delivered.
              </AlertDescription>
            </Alert>
          ) : (
            <div>
              <ScrollArea className="h-[45vh] mt-4">
                <div className="rounded-md border">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Description</TableHead>
                        <TableHead className="w-[150px]">Quantity</TableHead>
                        <TableHead className="w-[150px]">Unit Cost</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {filteredItems?.map((item, index) => (
                        <TableRow key={index}>
                          <TableCell>
                            {
                              item.item_quotation_details.item_details
                                .item_description
                            }
                          </TableCell>
                          <TableCell>
                            {item.item_quotation_details.item_details.quantity}
                          </TableCell>
                          <TableCell>
                            ₱
                            {parseFloat(
                              item.item_quotation_details.unit_price
                            ).toFixed(2)}
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              </ScrollArea>
              <div className="mt-6 flex justify-end space-x-2">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setIsDialogOpen(false)}
                >
                  Cancel
                </Button>
                <Button onClick={handleOrderReceived} disabled={isLoading}>
                  {isLoading ? (
                    <Loader2 className="w-4 h-4 animate-spin mr-2" />
                  ) : (
                    <p className="flex">
                      <Package className="w-4 h-4 mr-2" />
                      Confirm Order
                    </p>
                  )}
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
      <MessageDialog
        open={messageDialog.open}
        message={messageDialog.message}
        title={messageDialog.title}
        type={messageDialog.type}
        onOpenChange={(open) => setMessageDialog((prev) => ({ ...prev, open }))}
      />
    </>
  );
}
