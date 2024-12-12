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
import { Package, Loader2, AlertCircle } from 'lucide-react';
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import {
  useAddInspectionReport,
  useAddItemsDelivered,
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
import { useEffect, useState } from "react";
import { v4 as uuidv4 } from "uuid";
import { DeliveredFormType, SupplierItemType, deliveredFormSchema } from "@/types/request/purchase-order";

interface CategorizedItems {
  completedItems: SupplierItemType[];
  incompleteItems: SupplierItemType[];
  stockItems: SupplierItemType[];
}

const categorizeItems = (items: DeliveredFormType['items']): CategorizedItems => {
  const completedItems: SupplierItemType[] = [];
  const incompleteItems: SupplierItemType[] = [];
  const stockItems: SupplierItemType[] = [];

  items.forEach((item) => {
    const orderedQuantity = parseInt(item.item_quotation_details.item_details.quantity || "0", 10);
    const deliveredQuantity = item.quantity_delivered || 0;

    if (deliveredQuantity === orderedQuantity) {
      completedItems.push(item);
    } else if (deliveredQuantity < orderedQuantity) {
      incompleteItems.push(item);
    } else {
      completedItems.push({...item, quantity_delivered: orderedQuantity});
      stockItems.push({...item, quantity_delivered: deliveredQuantity - orderedQuantity});
    }
  });

  return { completedItems, incompleteItems, stockItems };
}

interface OrderReceivedDialogProps {
  po_no: string;
  supplier_no: string;
  isDialogOpen: boolean;
  setIsDialogOpen: (open: boolean) => void;
  items_: SupplierItemType[];
}

const areAllItemsFullyDelivered = (items: DeliveredFormType) => {
  return items.items.every((item) => {
    const orderedQuantity = parseInt(
      item.item_quotation_details.item_details.quantity || "0",
      10
    );
    const deliveredQuantity = item.quantity_delivered || 0;

    return deliveredQuantity >= orderedQuantity;
  });
};

export function OrderReceivedDialog({
  po_no,
  supplier_no,
  items_,
  isDialogOpen,
  setIsDialogOpen,
}: OrderReceivedDialogProps) {
  const [filteredItems, setFilteredItems] = useState<SupplierItemType[]>([]);

  const { mutate: updateStatusMutation, isPending: updateStatusPending } =
    useUpdatePurchaseOrderStatus();
  const { mutate: addInspectionMutation, isPending: addInspectionPending } =
    useAddInspectionReport();
  const { mutate: addItemsDeliveredMutation, isPending: addItemsPending } =
    useAddItemsDelivered();

  const isLoading =
    updateStatusPending || addInspectionPending || addItemsPending;

  useEffect(() => {
    if (isDialogOpen) {
      const filteredItems = items_.filter((item) => item.supplier_details.supplier_no === supplier_no);
      setFilteredItems(filteredItems);
    }
  }, [items_, supplier_no, isDialogOpen]);

  const form = useForm<DeliveredFormType>({
    resolver: zodResolver(deliveredFormSchema),
    defaultValues: {
      items: [],
    },
  });


  const { fields, append } = useFieldArray({
    name: "items",
    control: form.control,
  });

  useEffect(() => {
    form.reset({ items: [] });
    filteredItems.forEach((item) => append(item));
  }, [filteredItems, append, form]);

  const onSubmit = (values: DeliveredFormType) => {
    const {completedItems, incompleteItems, stockItems} = categorizeItems(values.items)

    const allItemsDelivered = areAllItemsFullyDelivered(values);
    const inspectionData = {
      inspection_no: uuidv4(),
      purchase_request: values.items[0].supplier_details.aoq_details.pr_details.pr_no,
      purchase_order: po_no,
    };
    addInspectionMutation(inspectionData, {
      onSuccess: async (inspectionResponse) => {
        const inspectionNo = inspectionResponse.data?.inspection_no;

        const itemDeliveredData = values.items.map((data) => {
          return {
            inspection: inspectionNo!,
            supplier_item: data.supplier_item_no,
            quantity_delivered: data.quantity_delivered!,
          };
        });

        await Promise.all(
          itemDeliveredData.map((data) => {
            addItemsDeliveredMutation(data);
          })
        );
        updateStatusMutation({
          po_no: po_no,
          status: allItemsDelivered ? "Completed" : "Lacking",
        });
      },

    });

    setIsDialogOpen(false)
  };


  return (
    <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
      <DialogContent className="max-w-4xl">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold">
            Order Received
          </DialogTitle>
          <p>{po_no}</p>
        </DialogHeader>
        {filteredItems.length === 0 ? (
          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertTitle>Error</AlertTitle>
            <AlertDescription>
              No order items found. Please check your order data.
            </AlertDescription>
          </Alert>
        ) : (
          <div>
            <Form {...form}>
              <form
                onSubmit={form.handleSubmit(onSubmit)}
                className="space-y-8"
              >
                <ScrollArea className="h-[30vh] mt-4">
                  <div className="rounded-md border">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Description</TableHead>
                          <TableHead className="w-[150px]">
                            Ordered Quantity
                          </TableHead>
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
                              {field.item_quotation_details.item_details.item_description}
                            </TableCell>
                            <TableCell>
                              {field.item_quotation_details.item_details.quantity}
                            </TableCell>
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
