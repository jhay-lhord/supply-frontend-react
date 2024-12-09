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
  useAbstractOfQuotation,
  useAllItemSelectedQuote,
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
  aoq_no: string;
  pr_no: string;
  total_amount: number;
  isDialogOpen: boolean;
  setIsDialogOpen: (open: boolean) => void;
}

export const PurchaseOrderForm: React.FC<PurchaseOrderFormProps> = ({
  aoq_no,
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
    },
  });
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const { data } = useAbstractOfQuotation();
  const { data: item_quotation } = useAllItemSelectedQuote();
  const { mutate } = useAddPurchaseOrder();
  const { mutate: addPRItemMutation } = useAddPurchaseOrderItem();

  const navigate = useNavigate()

  const abstracts = Array.isArray(data?.data) ? data.data : [];
  const filteredAbstract = abstracts.filter(
    (abstract) => abstract.aoq_no === aoq_no
  );

  const abstractWithSamePR = abstracts.find(
    (data) => data.pr_details.pr_no === pr_no
  );

  const rfq_no = abstractWithSamePR?.rfq_details.rfq_no;

  const itemQuotation = Array.isArray(item_quotation?.data)
    ? item_quotation.data
    : [];

  const filteredItemQuotation = itemQuotation.filter(
    (item) => item.aoq === aoq_no
  );

  const item_quotation_no = filteredItemQuotation.map(
    (item) => item.item_selected_no
  );

  useEffect(() => {
    if (isDialogOpen) {
      setValue("po_no", aoq_no!);
      setValue("total_amount", total_amount!);
      setValue("purchase_request", pr_no);
      setValue("request_for_quotation", rfq_no!);
      setValue("abstract_of_quotation", aoq_no!);
    }
  }, [setValue, aoq_no, pr_no, isDialogOpen, rfq_no, total_amount]);

  const onSubmit = async (data: purchaseOrderType) => {
    setIsLoading(true);
    const result = purchaseOrderSchema.safeParse(data);

    if (result.success) {
      await mutate(data, {
        onSuccess: async (poResponse) => {
          const po_no = poResponse.data?.po_no;
          const purchaseOrderItem = item_quotation_no.map((item) => {
            return {
              po_item_no: uuidv4(),
              purchase_request: pr_no,
              purchase_order: po_no!,
              aoq_item: item,
            };
          });

          await Promise.all(
            purchaseOrderItem.map((prItem) => {
              addPRItemMutation(prItem);
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
            {filteredAbstract.map((data, index) => (
              <div key={index} className="bg-muted p-4 rounded-lg space-y-4">
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="text-lg font-semibold">
                      {data.pr_details.pr_no}
                    </h3>
                    <p className="text-sm text-muted-foreground">
                      Requested by: {data.pr_details.requested_by}
                    </p>
                  </div>
                  <Button variant="outline" onClick={()=> navigate(`/supply/purchase-request/${data.pr_details.pr_no}`)}>
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
                  <Separator orientation="vertical" className="h-8"/>
                  <div className="flex items-center space-x-2">
                    <MapPinIcon className="w-4 h-4 text-muted-foreground" />
                    <p className="text-sm font-medium">
                      {data.rfq_details.supplier_address}
                    </p>
                  </div>
                  <Separator orientation="vertical" className="h-8"/>

                  <div className="flex items-center space-x-2">
                    <CreditCard className="w-4 h-4 font-medium" />
                    <p className="text-sm font-medium">TIN: {data.rfq_details.tin}</p>
                  </div>
                  <Separator orientation="vertical" className="h-8"/>

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
              <div className="grid grid-cols-12 gap-4 text-sm font-medium text-muted-foreground mb-2">
                <div className="col-span-1">#</div>
                <div className="col-span-1">Unit</div>
                <div className="col-span-6">Description</div>
                <div className="col-span-2">Quantity</div>
                <div className="col-span-2">Unit Cost</div>
              </div>
              <ScrollArea className="h-[150px] pr-4">
                {filteredItemQuotation.map((item, index) => (
                  <div
                    key={index}
                    className="grid grid-cols-12 gap-4 text-sm py-2 border-t border-border"
                  >
                    <div className="col-span-1">{index + 1}</div>
                    <div className="col-span-1">
                      {item.item_qoutation_details.item_details.unit}
                    </div>
                    <div className="col-span-6">
                      {
                        item.item_qoutation_details.item_details
                          .item_description
                      }
                    </div>
                    <div className="col-span-2">
                      {item.item_qoutation_details.item_details.quantity}
                    </div>
                    <div className="col-span-2">
                      ₱
                      {Number(item.item_qoutation_details.unit_price).toFixed(
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
