import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogHeader,
  DialogContent,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import {
  useGetAllSupplier,
  useGetAllSupplierItem,
} from "@/services/AbstractOfQuotationServices";
import { generatePONo, hasMultipleSuppliers } from "@/services/generatePONo";
import {
  useAddPurchaseOrder,
  useAddPurchaseOrderItem,
} from "@/services/puchaseOrderServices";
import {
  usePurchaseRequestActions,
  usePurchaseRequestList,
} from "@/services/purchaseRequestServices";
import {
  purchaseOrderSchema,
  purchaseOrderType,
} from "@/types/request/purchase-order";
import { zodResolver } from "@hookform/resolvers/zod";
import { FileText, Loader2, ShoppingCart } from "lucide-react";
import { useCallback, useEffect, useMemo, useState } from "react";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import { v4 as uuidv4 } from "uuid";
import Loading from "../../shared/components/Loading";
import SupplierInformation from "./SupplierInformation";
import { MessageDialog } from "../../shared/components/MessageDialog";
import { AxiosError } from "axios";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

interface PurchaseOrderFormProps {
  usedPos: string[];
  isManySupplier: boolean;
  supplier_no: string;
  pr_no: string;
  total_amount: number;
  isDialogOpen: boolean;
  setIsDialogOpen: (open: boolean) => void;
}

interface messageDialogProps {
  open: boolean;
  message: string;
  title: string;
  type: "success" | "error" | "info";
}

export const PurchaseOrderForm: React.FC<PurchaseOrderFormProps> = ({
  supplier_no,
  pr_no,
  total_amount,
  isDialogOpen,
  setIsDialogOpen,
}) => {
  const { handleSubmit, reset, setValue } = useForm({
    resolver: zodResolver(purchaseOrderSchema),
    defaultValues: {
      po_no: "",
      total_amount: total_amount,
      purchase_request: pr_no,
      request_for_quotation: "",
      abstract_of_quotation: "",
      supplier: "",
    },
  });
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [messageDialog, setMessageDialog] = useState<messageDialogProps>({
    open: false,
    message: "",
    title: "",
    type: "success" as const,
  });

  const navigate = useNavigate();

  const { data: supplier } = useGetAllSupplier();
  const { data: supplier_item } = useGetAllSupplierItem();
  const { data: purchase_request, isLoading: isPrLoading } =
    usePurchaseRequestList(pr_no);
  const { mutate: addPOMutation } = useAddPurchaseOrder();
  const { mutate: addPOItemMutation } = useAddPurchaseOrderItem();
  const { handleOrderPlaced } = usePurchaseRequestActions();

  const purchaseRequestData = useMemo(() => {
    return purchase_request && purchase_request?.data;
  }, [purchase_request]);

  const supplier_ = useMemo(() => {
    return Array.isArray(supplier?.data) ? supplier.data : [];
  }, [supplier]);

  const supplierItemData = useMemo(() => {
    return Array.isArray(supplier_item?.data) ? supplier_item.data : [];
  }, [supplier_item]);

  const supplierData = useMemo(() => {
    return supplier_.filter(
      (data) => data.rfq_details.purchase_request === pr_no
    );
  }, [supplier_, pr_no]);
  console.log(supplierData);

  const filteredSupplierItemData = useMemo(() => {
    return supplierItemData.filter(
      (item) => item.rfq_details.purchase_request === pr_no
    );
  }, [supplierItemData, pr_no]);

  const filterItemBySupplier = useCallback(
    (supplier_no: string) => {
      return filteredSupplierItemData.filter(
        (data) => data.supplier_details.supplier_no === supplier_no
      );
    },
    [filteredSupplierItemData]
  );

  const aoq_no = useMemo(() => {
    return filteredSupplierItemData.find((supplier) => supplier.rfq_details)
      ?.supplier_details.aoq_details.aoq_no;
  }, [filteredSupplierItemData]);

  const rfq_no = useMemo(() => {
    return filteredSupplierItemData.find((supplier) => supplier)?.rfq_details
      .rfq_no;
  }, [filteredSupplierItemData]);

  const totalAmount = useMemo(() => {
    return filteredSupplierItemData.reduce(
      (accumulator, item) => Number(accumulator) + Number(item.total_amount),
      0
    );
  }, [filteredSupplierItemData]);

  useEffect(() => {
    if (isDialogOpen) {
      setValue("po_no", pr_no); //set the initial value of po_no to pr_no, and later it will have a dynamic value when submitting
      setValue("total_amount", total_amount!);
      setValue("purchase_request", pr_no);
      setValue("request_for_quotation", rfq_no!);
      setValue("abstract_of_quotation", aoq_no!);
      setValue("supplier", supplier_no!);
    }
  }, [
    setValue,
    aoq_no,
    pr_no,
    isDialogOpen,
    rfq_no,
    total_amount,
    supplier_no,
  ]);

  const onSubmit = async (data: purchaseOrderType) => {
    let isOrderPlaced = false;
    const isMultipleSupplier = hasMultipleSuppliers(supplierData);
    setIsLoading(true);

    const result = purchaseOrderSchema.safeParse(data);

    if (!result.success) {
      reset();
      setIsLoading(false);
      setIsDialogOpen(false);

      setMessageDialog({
        open: true,
        message: "Something went wrong, please try again later",
        title: "Error",
        type: "error",
      });
    }

    const addPurchaseOrders = supplierData.map(async (supplier, index) => {
      const poNo = generatePONo(
        data.purchase_request,
        index,
        isMultipleSupplier
      );
      try {
        await addPOMutation(
          {
            ...data,
            supplier: supplier.supplier_no,
            po_no: poNo,
          },
          {
            onSuccess: async (response) => {
              if (response.status === "success") {
                const po_no = response.data?.po_no;
                const purchaseOrderItem = supplierItemData.map((item) => {
                  return {
                    po_item_no: uuidv4(),
                    purchase_request: pr_no,
                    purchase_order: po_no!,
                    supplier_item: item.supplier_item_no,
                  };
                });

                await Promise.all(
                  purchaseOrderItem.map((prItem) => {
                    addPOItemMutation(prItem);
                  })
                );
                reset();
                setIsLoading(false);
                setIsDialogOpen(false);
                isOrderPlaced = true;

                setMessageDialog({
                  open: true,
                  message: "Order placed successfully",
                  title: "Success",
                  type: "success",
                });
              } else {
                reset();
                setIsLoading(false);
                setIsDialogOpen(false);

                setMessageDialog({
                  open: true,
                  message: "Something went wrong, please try again later",
                  title: "Error",
                  type: "error",
                });
              }
            },
            onError: () => {
              reset();
              setIsLoading(false);
              setIsDialogOpen(false);

              setMessageDialog({
                open: true,
                message: "Something went wrong, please try again later",
                title: "Error",
                type: "error",
              });
            },
          }
        );
      } catch (error) {
        reset();
        setIsLoading(false);
        setIsDialogOpen(false);

        setMessageDialog({
          open: true,
          message:
            (error as AxiosError).message ??
            "Something went wrong, please try again",
          title: "Error",
          type: "error",
        });
      }
    });
    // Execute all purchase orders concurrently
    await Promise.all(addPurchaseOrders);
    //Update the status of purchase request
    if (isOrderPlaced) return handleOrderPlaced(data.purchase_request);
  };

  return (
    <>
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="max-w-4xl">
          {isPrLoading ? (
            <Loading />
          ) : (
            <form onSubmit={handleSubmit(onSubmit)}>
              <DialogHeader>
                <DialogTitle className="text-2xl font-bold">
                  Confirm Order
                </DialogTitle>
              </DialogHeader>
              <div className="mt-4 space-y-6">
                <div className="border-2 p-4 rounded-lg space-y-4">
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="text-xl font-semibold">
                        {purchaseRequestData?.pr_no}
                      </h3>
                      <p className="text-sm text-muted-foreground">
                        Requested by:
                        {purchaseRequestData?.requisitioner_details.name}
                      </p>
                    </div>
                    <Button
                      variant="outline"
                      onClick={() =>
                        navigate(
                          `/supply/purchase-request/${purchaseRequestData?.pr_no}`
                        )
                      }
                    >
                      <FileText className="w-4 h-4 mr-2" />
                      View PR
                    </Button>
                  </div>
                  <Separator />
                  <div className="grid grid-cols-3">
                    {supplierData.map((data) => (
                      <SupplierInformation supplier={data} />
                    ))}
                  </div>
                </div>
              </div>
              <div className="mt-4">
                <h3 className="text-lg font-semibold mb-4">Order Items</h3>
                <ScrollArea className="h-[200px]">
                  {supplierData?.map((supplier, index) => (
                    <div key={index} className="mb-6">
                      <h3 className="text-lg font-semibold mb-2">
                        {supplier.rfq_details.supplier_name}
                      </h3>
                      <Table>
                        <TableHeader>
                          <TableRow>
                            <TableHead>Item</TableHead>
                            <TableHead>Quantity</TableHead>
                            <TableHead>Price</TableHead>
                            <TableHead>Total</TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {filterItemBySupplier(supplier.supplier_no).map(
                            (item, index) => {
                              const itemDescription =
                                item.item_quotation_details.item_details
                                  .item_description;
                              const itemQuantity = Number(
                                item.item_quotation_details.item_details
                                  .quantity
                              );
                              const itemUnitPrice = Number(
                                item.item_quotation_details.unit_price
                              );
                              return (
                                <TableRow key={index}>
                                  <TableCell>{itemDescription}</TableCell>
                                  <TableCell>{itemQuantity}</TableCell>
                                  <TableCell>
                                    ₱{itemUnitPrice.toFixed(2)}
                                  </TableCell>
                                  <TableCell>
                                    ₱{(itemQuantity * itemUnitPrice).toFixed(2)}
                                  </TableCell>
                                </TableRow>
                              );
                            }
                          )}
                        </TableBody>
                      </Table>
                      <div className="mt-2 flex justify-end">
                        <Button>Place Order</Button>
                      </div>
                    </div>
                  ))}
                </ScrollArea>
              </div>
              <div className="mt-2 flex justify-end">
                <div className="bg-muted p-2 rounded-lg">
                  <p className="text-lg font-semibold">
                    Total Amount: ₱{totalAmount}
                  </p>
                </div>
              </div>
              <DialogFooter className="mt-4">
                <Button type="submit" disabled={isLoading}>
                  {isLoading ? (
                    <Loader2 className="w-4 h-4 animate-spin mr-2" />
                  ) : (
                    <ShoppingCart className="w-4 h-4 mr-2" />
                  )}
                  {isLoading ? "Processing..." : "Place Order"}
                </Button>
              </DialogFooter>
            </form>
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
};
