import { useState, useCallback, useMemo, useEffect, useRef } from "react";
import {
  useGetAllSupplier,
  useGetAllSupplierItem,
  useUpdateSupplierIsAddedToTrue,
} from "@/services/AbstractOfQuotationServices";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import {
  usePurchaseRequest,
  usePurchaseRequestActions,
} from "@/services/purchaseRequestServices";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { supplierType_ } from "@/types/response/abstract-of-quotation";
import { Loader2, PackageOpen, ShoppingCart } from "lucide-react";
import { v4 as uuidv4 } from "uuid";
import { AxiosError } from "axios";
import { purchaseOrderType } from "@/types/request/purchase-order";
import { ApiResponse } from "@/types/response/api-response";
import {
  useAddPurchaseOrder,
  useAddPurchaseOrderItem,
} from "@/services/puchaseOrderServices";
import { MessageDialog } from "../../shared/components/MessageDialog";

interface messageDialogProps {
  open: boolean;
  message: string;
  title: string;
  type: "success" | "error" | "info";
}

export default function SupplyAOQ() {
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [orderPlacedSupplierNo, setOrderPlacedSupplierNo] = useState<string[]>(
    []
  );
  const [messageDialog, setMessageDialog] = useState<messageDialogProps>({
    open: false,
    message: "",
    title: "",
    type: "success" as const,
  });

  const filteredStatus = "Ready to Order";
  const { data: purchase_request, isLoading: isPRLoading } =
    usePurchaseRequest();
  const { data: supplier, isLoading: isSupplierLoading } = useGetAllSupplier();
  const { data: supplier_item, isLoading: isSupplierItemLoading } =
    useGetAllSupplierItem();
  const { mutate: updateSupplierIsAddedToTrueMutation } =
    useUpdateSupplierIsAddedToTrue();
  const { mutate: addPOMutation } = useAddPurchaseOrder();
  const { mutate: addPOItemMutation } = useAddPurchaseOrderItem();
  const { handleOrderPlaced } = usePurchaseRequestActions();

  const isAllLoading =
    isPRLoading || isSupplierLoading || isSupplierItemLoading;
  console.log(isAllLoading);

  const purchaseRequestData = useMemo(() => {
    return Array.isArray(purchase_request?.data) ? purchase_request.data : [];
  }, [purchase_request]);

  const filteredPurchaseRequestData = useMemo(() => {
    return purchaseRequestData.filter((data) => data.status === filteredStatus);
  }, [purchaseRequestData, filteredStatus]);

  const supplierData = useMemo(() => {
    return Array.isArray(supplier?.data) ? supplier.data : [];
  }, [supplier]);

  console.log(supplierData);

  const supplierItemData = useMemo(() => {
    return Array.isArray(supplier_item?.data) ? supplier_item.data : [];
  }, [supplier_item]);

  const memoizedHandleOrderPlaced = useCallback(
    (pr_no: string) => {
      handleOrderPlaced(pr_no);
    },
    [handleOrderPlaced]
  );

  const filteredSupplierData = useCallback(
    (pr_no: string) => {
      return supplierData.filter(
        (item) =>
          item.rfq_details.purchase_request === pr_no &&
          !orderPlacedSupplierNo.includes(item.supplier_no) &&
          !item.is_added
      );
    },
    [supplierData, orderPlacedSupplierNo]
  );

  const filterItemBySupplier = useCallback(
    (supplier_no: string) => {
      return supplierItemData.filter(
        (data) => data.supplier_details.supplier_no === supplier_no
      );
    },
    [supplierItemData]
  );

  const calculateSupplierTotal = useCallback(
    (supplierNo: string) => {
      return filterItemBySupplier(supplierNo).reduce((total, item) => {
        const itemQuantity = Number(
          item.item_quotation_details.item_details.quantity
        );
        const itemUnitPrice = Number(item.item_quotation_details.unit_price);
        return total + itemQuantity * itemUnitPrice;
      }, 0);
    },
    [filterItemBySupplier]
  );

  const areAllSuppliersOrdered = useMemo(() => {
    if (
      isAllLoading ||
      supplierData.length === 0 ||
      filteredPurchaseRequestData.length === 0
    )
      return {};

    const checkPRSuppliers = (prNo: string) => {
      const prSuppliers = supplierData.filter(
        (item) => item.rfq_details.purchase_request === prNo
      );
      return (
        prSuppliers.length > 0 &&
        prSuppliers.every((supplier) =>
          orderPlacedSupplierNo.includes(supplier.supplier_no)
        )
      );
    };

    return filteredPurchaseRequestData.reduce((acc, pr) => {
      acc[pr.pr_no] = checkPRSuppliers(pr.pr_no);
      return acc;
    }, {} as Record<string, boolean>);
  }, [
    filteredPurchaseRequestData,
    isAllLoading,
    supplierData,
    orderPlacedSupplierNo,
  ]);

  const processedPRs = useRef(new Set<string>());
  useEffect(() => {
    Object.entries(areAllSuppliersOrdered).forEach(([pr_no, allOrdered]) => {
      if (allOrdered && !processedPRs.current.has(pr_no)) {
        processedPRs.current.add(pr_no);
        memoizedHandleOrderPlaced(pr_no);
      }
    });
  }, [
    areAllSuppliersOrdered,
    orderPlacedSupplierNo,
    memoizedHandleOrderPlaced,
  ]);

  const handlePlaceOrder = useCallback(
    async (
      supplierData: supplierType_,
      supplierNo: string,
      pr_no: string,
      aoq_no: string,
      rfq_no: string
    ) => {
      setIsLoading(true);
      const isMultipleSupplier = filteredSupplierData(pr_no).length > 1;
      const poNoOfMultipleSupplier = `${pr_no}${supplierData.extra_character}`;
      const poNo = isMultipleSupplier ? poNoOfMultipleSupplier : pr_no;
      const totalAmount = calculateSupplierTotal(supplierNo);
      const supplierItemData = filterItemBySupplier(supplierNo);

      try {
        await addPOMutation(
          {
            po_no: poNo,
            total_amount: totalAmount,
            purchase_request: pr_no,
            abstract_of_quotation: aoq_no,
            request_for_quotation: rfq_no,
            supplier: supplierNo,
          },
          {
            onSuccess: async (response: ApiResponse<purchaseOrderType>) => {
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
                setIsLoading(false);

                setMessageDialog({
                  open: true,
                  message: "Order placed successfully",
                  title: "Success",
                  type: "success",
                });

                updateSupplierIsAddedToTrueMutation({
                  supplier_no: supplierNo,
                });
                setOrderPlacedSupplierNo((prev) => [...prev, supplierNo]);
              } else {
                setIsLoading(false);

                setMessageDialog({
                  open: true,
                  message: "Something went wrong, please try again later",
                  title: "Error",
                  type: "error",
                });
              }
            },
            onError: () => {
              setIsLoading(false);

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
        setIsLoading(false);

        setMessageDialog({
          open: true,
          message:
            (error as AxiosError).message ??
            "Something went wrong, please try again",
          title: "Error",
          type: "error",
        });
      }
    },
    [
      calculateSupplierTotal,
      updateSupplierIsAddedToTrueMutation,
      filteredSupplierData,
      addPOMutation,
      addPOItemMutation,
      filterItemBySupplier,
    ]
  );

  const renderSupplierCard = useCallback(
    (supplier: supplierType_, prNo: string, index: number) => {
      return (
        <div key={supplier.supplier_no} className="mb-6">
          <h3 className="text-lg font-semibold mb-2">
            {supplier.rfq_details.supplier_name}
            <span className="text-primary mx-2">
              Total: ₱{calculateSupplierTotal(supplier.supplier_no).toFixed(2)}
            </span>
            <span>{index}</span>
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
              {filterItemBySupplier(supplier.supplier_no).map((item, index) => {
                const itemDescription =
                  item.item_quotation_details.item_details.item_description;
                const itemQuantity = Number(
                  item.item_quotation_details.item_details.quantity
                );
                const itemUnitPrice = Number(
                  item.item_quotation_details.unit_price
                );
                return (
                  <TableRow key={index}>
                    <TableCell>{itemDescription}</TableCell>
                    <TableCell>{itemQuantity}</TableCell>
                    <TableCell>₱{itemUnitPrice.toFixed(2)}</TableCell>
                    <TableCell>
                      ₱{(itemQuantity * itemUnitPrice).toFixed(2)}
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
          <div className="flex justify-end mt-4">
            <Button
              onClick={() =>
                handlePlaceOrder(
                  supplier,
                  supplier.supplier_no,
                  prNo,
                  supplier.aoq_details.aoq_no,
                  supplier.rfq_details.rfq_no
                )
              }
              disabled={isLoading}
            >
              {isLoading ? <Loader2 className="animate-spin" /> : "Place Order"}
            </Button>
          </div>
        </div>
      );
    },
    [filterItemBySupplier, handlePlaceOrder, calculateSupplierTotal, isLoading]
  );

  return (
    <>
      {filteredPurchaseRequestData.length > 0 ? (
        filteredPurchaseRequestData.map((data) => (
          <Card key={data.pr_no} className="mb-6">
            <CardHeader>
              <CardTitle className="flex items-center">
                <ShoppingCart className="mr-2 h-5 w-5" />
                {data.pr_no} - {data.requisitioner_details.name}
              </CardTitle>
            </CardHeader>
            <CardContent>
              {filteredSupplierData(data.pr_no).map((supplier, index) =>
                renderSupplierCard(supplier, data.pr_no, index)
              )}
            </CardContent>
          </Card>
        ))
      ) : (
        <TableRow>
          <TableCell colSpan={7} className="h-24 text-center">
            <div className="flex flex-col items-center justify-center space-y-3">
              <PackageOpen className="h-8 w-8 text-gray-400" />
              <div className="text-lg font-medium text-gray-900">
                No Orders in Progress
              </div>
              <div className="text-sm text-gray-500">
                There are currently no orders in progress.
              </div>
            </div>
          </TableCell>
        </TableRow>
      )}
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
