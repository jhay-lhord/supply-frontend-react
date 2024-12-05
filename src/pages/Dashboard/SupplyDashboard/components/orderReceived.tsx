import { useForm } from "react-hook-form";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
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
import { purchaseOrdertype_ } from "@/types/response/purchase-order";
import { itemSelectedType_ } from "@/types/response/abstract-of-quotation";
import { useUpdatePurchaseOrderStatus } from "@/services/puchaseOrderServices";

interface OrderReceivedFormData {
  [key: string]: number;
}

interface OrderReceivedDialogProps {
  isDialogOpen: boolean;
  setIsDialogOpen: (open: boolean) => void;
  items: itemSelectedType_[];
  orderData: purchaseOrdertype_[];
}

export function OrderReceivedDialog({
  items,
  orderData,
  isDialogOpen,
  setIsDialogOpen
}: OrderReceivedDialogProps) {
  const {
    formState: { isSubmitting },
  } = useForm<OrderReceivedFormData>();

  const poNo = orderData.length > 0 ? orderData[0].po_no : ""
  const { mutate } = useUpdatePurchaseOrderStatus()

  const handleStatusUpdate = () => {
    mutate({po_no:poNo, status:"Completed"})
  }

  return (
    <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
      <DialogContent className="max-w-4xl ">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold">
            Order Received
          </DialogTitle>
          <p>{poNo}</p>
        </DialogHeader>
        {items.length === 0 ? (
          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertTitle>Error</AlertTitle>
            <AlertDescription>
              No order items found. Please check your order data.
            </AlertDescription>
          </Alert>
        ) : (
          <div>
            <ScrollArea className="h-[30vh] mt-4">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Item</TableHead>
                    <TableHead>Ordered Quantity</TableHead>
                    <TableHead>Unit</TableHead>
                    <TableHead>Delivered Quantity</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {items.map((item) => (
                    <TableRow key={item.item_selected_no}>
                      <TableCell>
                        {
                          item.item_qoutation_details.item_details
                            .item_description
                        }
                      </TableCell>
                      <TableCell>
                        {item.item_qoutation_details.item_details.quantity}
                      </TableCell>
                      <TableCell>
                        {item.item_qoutation_details.item_details.unit}
                      </TableCell>
                      <TableCell>
                        <Input />
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </ScrollArea>
            <div className="mt-6 flex justify-end space-x-2">
              <Button
                type="button"
                variant="outline"
                onClick={() => setIsDialogOpen(false)}
              >
                Cancel
              </Button>
              <Button type="submit" disabled={isSubmitting} onClick={handleStatusUpdate}>
                {isSubmitting ? (
                  <Loader2 className="w-4 h-4 animate-spin mr-2" />
                ) : (
                  <Package className="w-4 h-4 mr-2" />
                )}
                {isSubmitting ? "Processing..." : "Confirm Receipt"}
              </Button>
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}
