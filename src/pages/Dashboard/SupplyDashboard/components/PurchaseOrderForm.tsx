import { Badge } from "@/components/ui/badge";
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
import {
  useAddPurchaseOrder,
  useAddPurchaseOrderItem,
} from "@/services/puchaseOrderServices";
import {
  purchaseOrderSchema,
  purchaseOrderType,
} from "@/types/request/purchase-order";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Building2,
  CreditCard,
  FileText,
  Loader2,
  MapPinIcon,
  ShoppingCart,
} from "lucide-react";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import { v4 as uuidv4 } from "uuid";
interface PurchaseOrderFormProps {
  supplier_no: string;
  pr_no: string;
  total_amount: number;
  isDialogOpen: boolean;
  setIsDialogOpen: (open: boolean) => void;
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

  const navigate = useNavigate();
  const { data: supplier } = useGetAllSupplier();
  const { data: supplier_item } = useGetAllSupplierItem();
  const { mutate: addPOMutation } = useAddPurchaseOrder();
  const { mutate: addPOItemMutation } = useAddPurchaseOrderItem();

  const supplier_ = Array.isArray(supplier?.data) ? supplier.data : [];
  const supplier_item_ = Array.isArray(supplier_item?.data)
    ? supplier_item.data
    : [];

  const supplierData = supplier_.filter(
    (data) => data.supplier_no === supplier_no
  );

  const supplierItemData = supplier_item_.filter(
    (item) => item.supplier_details.supplier_no === supplier_no
  );
  console.log(supplierItemData);

  console.log(supplierData);

  const aoq_no = supplierData.find(
    (supplier) => supplier.supplier_no === supplier_no
  )?.aoq_details.aoq_no;

  const rfq_no = supplierData.find(
    (supplier) => supplier.supplier_no === supplier_no
  )?.rfq_details.rfq_no;


  useEffect(() => {
    if (isDialogOpen) {
      setValue("po_no", aoq_no!);
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
    setIsLoading(true);
    const result = purchaseOrderSchema.safeParse(data);

    if (result.success) {
      await addPOMutation(data, {
        onSuccess: async (poResponse) => {
          const po_no = poResponse.data?.po_no;
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
        },
      });
    }
  };

  return (
    <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
      <DialogContent className="max-w-4xl">
        <form onSubmit={handleSubmit(onSubmit)}>
          <DialogHeader>
            <DialogTitle className="text-2xl font-bold">
              Confirm Order
            </DialogTitle>
          </DialogHeader>
          <div className="mt-4 space-y-6">
            {supplierData.map((data, index) => (
              <div key={index} className="bg-muted p-4 rounded-lg space-y-4">
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="text-lg font-semibold">
                      {data.aoq_details.pr_details.pr_no}
                    </h3>
                    <p className="text-sm text-muted-foreground">
                      Requested by:{" "}
                      {data.aoq_details.pr_details.requisitioner_details.name}
                    </p>
                  </div>
                  <Button
                    variant="outline"
                    onClick={() =>
                      navigate(
                        `/supply/purchase-request/${data.aoq_details.pr_details.pr_no}`
                      )
                    }
                  >
                    <FileText className="w-4 h-4 mr-2" />
                    View PR
                  </Button>
                </div>
                <Separator />
                <div className="flex items-center gap-4">
                  <div className="flex items-center space-x-2">
                    <Building2 className="w-4 h-4 text-muted-foreground" />
                    <p className="text-sm font-medium">
                      {data.rfq_details.supplier_name}
                    </p>
                  </div>
                  <Separator orientation="vertical" className="h-8" />
                  <div className="flex items-center space-x-2">
                    <MapPinIcon className="w-4 h-4 text-muted-foreground" />
                    <p className="text-sm font-medium">
                      {data.rfq_details.supplier_address}
                    </p>
                  </div>
                  <Separator orientation="vertical" className="h-8" />

                  <div className="flex items-center space-x-2">
                    <CreditCard className="w-4 h-4 font-medium" />
                    <p className="text-sm font-medium">
                      TIN: {data.rfq_details.tin}
                    </p>
                  </div>
                  <Separator orientation="vertical" className="h-8" />

                  <Badge
                    variant={data.rfq_details.is_VAT ? "default" : "secondary"}
                  >
                    {data.rfq_details.is_VAT ? "VAT" : "Non-VAT"}
                  </Badge>
                </div>
              </div>
            ))}
          </div>
          <div className="mt-8">
            <h3 className="text-lg font-semibold mb-4">Order Items</h3>
            <div className="bg-muted p-4 rounded-lg">
              <div className="grid grid-cols-5 gap-4 text-sm font-medium text-muted-foreground mb-2">
                <div className="">#</div>
                <div className="">Unit</div>
                <div className="">Description</div>
                <div className="">Quantity</div>
                <div className="">Unit Cost</div>
              </div>
              <ScrollArea className="h-[150px] pr-4">
                {supplierItemData.map((item, index) => (
                  <div
                    key={index}
                    className="grid grid-cols-5 gap-4 text-sm py-2 border-t border-border"
                  >
                    <div className="">{index + 1}</div>
                    <div className="">
                      {item.item_quotation_details.item_details.unit}
                    </div>
                    <div className="">
                      {
                        item.item_quotation_details.item_details
                          .item_description
                      }
                    </div>
                    <div className="">
                      {item.item_quotation_details.item_details.quantity}
                    </div>
                    <div className="">
                      ₱
                      {Number(item.item_quotation_details.unit_price).toFixed(
                        2
                      )}
                    </div>
                  </div>
                ))}
              </ScrollArea>
            </div>
          </div>
          <div className="mt-2 flex justify-end">
            <div className="bg-muted p-2 rounded-lg">
              <p className="text-lg font-semibold">
                Total Amount: ₱{total_amount}
              </p>
            </div>
          </div>
          <DialogFooter className="mt-4">
            <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
              Cancel
            </Button>
            <Button type="submit" disabled={isLoading}>
              {isLoading ? (
                <Loader2 className="w-4 h-4 animate-spin mr-2" />
              ) : (
                <ShoppingCart className="w-4 h-4 mr-2" />
              )}
              {isLoading ? "Processing..." : "Confirm Order"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};
