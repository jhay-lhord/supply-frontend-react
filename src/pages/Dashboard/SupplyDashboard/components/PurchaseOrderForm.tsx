import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogHeader,
  DialogContent,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { ScrollArea } from "@/components/ui/scroll-area";
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
import { Loader2, ShoppingCart } from "lucide-react";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { v4 as uuidv4 } from "uuid";
interface PurchaseOrderFormProps {
  aoq_no: string;
  pr_no: string;
  isDialogOpen: boolean;
  setIsDialogOpen: (open: boolean) => void;
}

export const PurchaseOrderForm: React.FC<PurchaseOrderFormProps> = ({
  aoq_no,
  pr_no,
  isDialogOpen,
  setIsDialogOpen,
}) => {
  const {
    handleSubmit,
    reset,
    setValue,
  } = useForm({
    resolver: zodResolver(purchaseOrderSchema),
    defaultValues: {
      po_no: "",
      purchase_request: "",
      request_for_quotation: "",
      abstract_of_quotation: "",
      item_quotation: "",
    },
  });
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const { data } = useAbstractOfQuotation();
  const { data: item_quotation } = useAllItemSelectedQuote();
  const { mutate } = useAddPurchaseOrder();
  const { mutate: addPRItemMutation } = useAddPurchaseOrderItem();

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
      setValue("purchase_request", pr_no);
      setValue("request_for_quotation", rfq_no!);
      setValue("abstract_of_quotation", aoq_no!);
    }
  }, [setValue, aoq_no, pr_no, isDialogOpen, rfq_no]);

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
      <DialogContent className="max-w-full w-[50rem]">
        <form onSubmit={handleSubmit(onSubmit)}>
          <DialogHeader>
            <DialogTitle className="text-2xl">Confirm Order</DialogTitle>
          </DialogHeader>
          {filteredAbstract.map((data) => (
            <div className="flex justify-between my-4 p-4 bg-gray-200 rounded-md">
              <div className="rounded-md w-full">
                <div className="flex justify-between">
                  <p className="text-xl font-semibold">
                    {data.pr_details.pr_no}
                  </p>
                  <Button>View PR</Button>
                </div>
                <p>{data.pr_details.requested_by} </p>
                <p className="mt-2 text-base">
                  {data.rfq_details.supplier_name}
                </p>
                <p className="text-base">{data.rfq_details.supplier_address}</p>
                <p className="text-base">{data.rfq_details.tin}</p>
                <p className="text-base">
                  {data.rfq_details.is_VAT ? "VAT" : "non-VAT"}
                </p>
              </div>
            </div>
          ))}
          <p className="text-2xl">Items</p>
          <div className="grid grid-cols-6 uppercase gap-2 items-center border-b-2">
            <p className="text-base font-medium">Stock Property No.</p>
            <p className="text-base font-medium">Unit</p>
            <p className="text-base font-medium col-span-2">Description</p>
            <p className="text-base font-medium">Quantity</p>
            <p className="text-base font-medium">Unit Cost</p>
          </div>
          <ScrollArea className="h-[10rem] mb-9">
            {filteredItemQuotation.map((data, index) => (
              <div className="grid grid-cols-6 gap-2 mb-4 items-center p-2  border-b-2">
                <p>{index + 1}</p>
                <p>{data.item_qoutation_details.item_details.unit}</p>
                <p className="col-span-2">
                  {data.item_qoutation_details.item_details.item_description}
                </p>
                <p>{data.item_qoutation_details.item_details.quantity}</p>
                <p>{data.item_qoutation_details.item_details.unit_cost}</p>
              </div>
            ))}
          </ScrollArea>
          <DialogFooter>
            <Button
              className="text-base"
              variant={"outline"}
              onClick={() => setIsDialogOpen(false)}
            >
              Cancel
            </Button>
            <Button
              className={`text-slate-950 bg-orange-200 px-8 py-1 hover:bg-orange-300 ${
                isLoading && "px-16"
              }`}
              type="submit"
            >
              {isLoading ? (
                <Loader2 className="animate-spin" />
              ) : (
                <>
                  <p className="text-base mr-1">Confirm Order</p>
                  <ShoppingCart width={20} height={20} />
                </>
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};
