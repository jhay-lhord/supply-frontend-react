import { useFieldArray, useForm } from "react-hook-form";
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
import {
  addInspectionReport,
  useAddItemsDelivered,
  useAddStockItems,
  useGetItemsDelivered,
  useUpdateItemsDelivered,
  useUpdatePurchaseOrderStatus,
} from "@/services/puchaseOrderServices";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form";
import { useEffect, useMemo, useState } from "react";
import { v4 as uuidv4 } from "uuid";
import {
  DeliveredFormType,
  SupplierItemType,
  _itemsDeliveredType,
  deliveredFormSchema,
  StockItemType,
} from "@/types/request/purchase-order";

interface CategorizedItems {
  completedItems: SupplierItemType[];
  incompleteItems: SupplierItemType[];
  stockItems: StockItemType[];
}

const categorizeItems = (
  items: DeliveredFormType["items"]
): CategorizedItems => {
  const completedItems: SupplierItemType[] = [];
  const incompleteItems: SupplierItemType[] = [];
  const stockItems: StockItemType[] = [];

  items.forEach((item) => {
    const orderedQuantity = parseInt(
      item.item_quotation_details.item_details.quantity,
      10
    );
    const deliveredQuantity = item.quantity_delivered || 0;

    if (deliveredQuantity < orderedQuantity) {
      incompleteItems.push(item);
    } else if (deliveredQuantity === orderedQuantity) {
      completedItems.push(item);
    } else {
      completedItems.push({ ...item, quantity_delivered: orderedQuantity });
      stockItems.push({
        inspection: '',
        supplier_item: item.supplier_item_no,
        quantity_delivered: deliveredQuantity - orderedQuantity,
        is_complete: true
      });
    }
  });

  return { completedItems, incompleteItems, stockItems };
};

const isItemIncomplete = (
  item: SupplierItemType,
  originalQuantityDelivered: number
): boolean => {
  const orderedQuantity = parseInt(
    item.item_quotation_details.item_details.quantity,
    10
  );
  const totalDeliveredQuantity =
    (item.quantity_delivered || 0) + originalQuantityDelivered;
  return totalDeliveredQuantity < orderedQuantity;
};

interface OrderReceivedDialogProps {
  po_no: string;
  supplier_no: string;
  isDialogOpen: boolean;
  setIsDialogOpen: (open: boolean) => void;
  items_: SupplierItemType[];
}

export function OrderReceivedDialog({
  po_no,
  supplier_no,
  items_,
  isDialogOpen,
  setIsDialogOpen,
}: OrderReceivedDialogProps) {
  const [incompleteItems, setIncompleteItems] = useState<SupplierItemType[]>(
    []
  );

  const { data, refetch: refetchItemsDelivered } = useGetItemsDelivered();

  const itemDeliveredData = useMemo(() => {
    return Array.isArray(data?.data) ? data.data : [];
  }, [data?.data]);

  const { mutate: updateStatusMutation, isPending: updateStatusPending } =
    useUpdatePurchaseOrderStatus();

  const { mutate: addItemsDeliveredMutation, isPending: addItemsPending } =
    useAddItemsDelivered();

  const { mutate: addStockMutation } = useAddStockItems();
  const {
    mutate: updateItemsDeliveredMutation,
    isPending: updateItemsPending,
  } = useUpdateItemsDelivered();

  const isLoading =
    updateStatusPending || addItemsPending || updateItemsPending;

  useEffect(() => {
    if (isDialogOpen) {
      const filteredItems = items_
        .filter((item) => item.supplier_details.supplier_no === supplier_no)
        .filter((item) => {
          const orderedQuantity = parseInt(
            item.item_quotation_details.item_details.quantity,
            10
          );
          const deliveredQuantity = item.quantity_delivered || 0;
          return deliveredQuantity < orderedQuantity;
        });
      setIncompleteItems(filteredItems);
    }
  }, [items_, supplier_no, isDialogOpen]);

  const form = useForm<DeliveredFormType>({
    resolver: zodResolver(deliveredFormSchema),
    defaultValues: {
      items: [],
    },
  });

  const { fields, replace } = useFieldArray({
    name: "items",
    control: form.control,
  });

  useEffect(() => {
    replace(incompleteItems);
  }, [incompleteItems, replace]);

  const onSubmit = async (values: DeliveredFormType) => {
    const { completedItems, incompleteItems, stockItems } = categorizeItems(
      values.items
    );

    console.log(completedItems);
    console.log(incompleteItems);
    console.log(stockItems);

    const inspectionData = {
      inspection_no: uuidv4(),
      purchase_request:
        values.items[0].supplier_details.aoq_details.pr_details.pr_no,
      purchase_order: po_no,
    };

    try {
      const inspectionResponse = await addInspectionReport(inspectionData);
      const inspectionNo = inspectionResponse.data?.inspection_no;

      const itemDeliveredPromises = values.items.map(async (data) => {
        const newQuantityDelivered = data.quantity_delivered || 0;
        const originalItem = items_.find(
          (item) => item.supplier_item_no === data.supplier_item_no
        );
        const originalQuantityDelivered =
          originalItem?.old_delivered_quantity || 0;

        if (newQuantityDelivered !== 0) {
          const updateData = {
            supplier_item: data.supplier_item_no,
            quantity_delivered:
              newQuantityDelivered + originalQuantityDelivered,
            is_complete: !isItemIncomplete(data, originalQuantityDelivered),
            inspection: inspectionNo!,
          };

          const existingDelivery = itemDeliveredData.find(
            (item) =>
              item.item_details.supplier_item_no === data.supplier_item_no
          );

          if (existingDelivery) {
            // Update existing delivery
            return updateItemsDeliveredMutation({
              data: { ...updateData },
              id: existingDelivery.id,
            });
          } else {
            // Add new delivery
            return addItemsDeliveredMutation(updateData);
          }
        }
        return Promise.resolve(); // No change needed for this item
      });

      await Promise.all(itemDeliveredPromises);

      // Refetch the updated items delivered data
      const { data: refetchedData } = await refetchItemsDelivered();
      const latestItemDeliveredData = Array.isArray(refetchedData?.data)
        ? refetchedData.data
        : [];

      // Combine the newly submitted data with the latest fetched data
      const updatedDeliveries = [...latestItemDeliveredData];
      values.items.forEach((item) => {
        const originalItem = items_.find(
          (origItem) => origItem.supplier_item_no === item.supplier_item_no
        );
        const originalQuantityDelivered = originalItem?.quantity_delivered || 0;
        console.log(originalQuantityDelivered);
        if (originalItem) {
          originalItem.quantity_delivered =
            Number(originalItem.quantity_delivered) + originalQuantityDelivered;
        } else if (originalQuantityDelivered > 0) {
          updatedDeliveries.push({
            supplier_item: item.supplier_item_no,
            quantity_delivered: originalQuantityDelivered,
          } as _itemsDeliveredType);
        }
      });

      const allItemsComplete = items_.every((item) => {
        const orderedQuantity = Number(
          item.item_quotation_details.item_details.quantity
        );
        const latestDelivery = updatedDeliveries.find(
          (deliveredItem) =>
            deliveredItem.supplier_item === item.supplier_item_no
        );
        const totalDeliveredQuantity = Number(
          latestDelivery?.quantity_delivered || 0
        );
        console.log("Item:", item.supplier_item_no);
        console.log("Ordered Quantity:", orderedQuantity);
        console.log("Total Delivered Quantity:", totalDeliveredQuantity);
        return totalDeliveredQuantity >= orderedQuantity;
      });

      const newStatus = allItemsComplete ? "Completed" : "In Progress";

      await updateStatusMutation({
        po_no: po_no,
        status: newStatus,
      });

      if (stockItems.length > 0) {
        stockItems.forEach((stock) => addStockMutation({...stock, inspection: inspectionNo!}));
      }

      setIsDialogOpen(false);
    } catch (error) {
      console.error("Error processing order:", error);
      // Handle error (e.g., show error message to user)
    }
    setIsDialogOpen(false);
  };

  return (
    <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
      <DialogContent className="max-w-4xl">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold">
            To Recieve Items
          </DialogTitle>
          <p>{po_no}</p>
        </DialogHeader>
        {incompleteItems.length === 0 ? (
          <Alert>
            <AlertCircle className="h-4 w-4" />
            <AlertTitle>No To Recieve Items</AlertTitle>
            <AlertDescription>
              All items in this order have been fully delivered.
            </AlertDescription>
          </Alert>
        ) : (
          <div>
            <Form {...form}>
              <form
                onSubmit={form.handleSubmit(onSubmit)}
                className="space-y-8"
              >
                <ScrollArea className="h-[45vh] mt-4">
                  <div className="rounded-md border">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Description</TableHead>
                          <TableHead className="w-[150px]">
                            Ordered Quantity
                          </TableHead>
                          <TableHead className="w-[150px]">Remaining</TableHead>
                          <TableHead className="w-[150px]">Unit Cost</TableHead>
                          <TableHead className="w-[200px]">
                            Quantity Delivered
                          </TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {fields.map((field, index) => (
                          <TableRow key={field.id}>
                            <TableCell>
                              {
                                field.item_quotation_details.item_details
                                  .item_description
                              }
                            </TableCell>
                            <TableCell>
                              {
                                field.item_quotation_details.item_details
                                  .quantity
                              }
                            </TableCell>
                            <TableCell>{field.remaining_quantity}</TableCell>
                            <TableCell>
                              ₱
                              {parseFloat(
                                field.item_quotation_details.unit_price
                              ).toFixed(2)}
                            </TableCell>
                            <TableCell>
                              <FormField
                                control={form.control}
                                name={`items.${index}.quantity_delivered`}
                                render={({ field }) => (
                                  <FormItem>
                                    <FormControl>
                                      <Input
                                        {...field}
                                        type="number"
                                        onChange={(e) => {
                                          const value =
                                            e.target.value === ""
                                              ? undefined
                                              : parseInt(e.target.value, 10);
                                          field.onChange(value);
                                        }}
                                        className="w-20"
                                      />
                                    </FormControl>
                                    <FormMessage />
                                  </FormItem>
                                )}
                              />
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
                  <Button type="submit" disabled={isLoading}>
                    {isLoading ? (
                      <Loader2 className="w-4 h-4 animate-spin mr-2" />
                    ) : (
                      <Package className="w-4 h-4 mr-2" />
                    )}
                    {isLoading ? "Processing..." : "Confirm Receipt"}
                  </Button>
                </div>
              </form>
            </Form>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}
