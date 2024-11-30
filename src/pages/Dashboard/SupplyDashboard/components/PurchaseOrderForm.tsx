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
import { ShoppingCart } from "lucide-react";

interface PurchaseOrderFormProps {
  isDialogOpen: boolean;
  setIsDialogOpen: (open: boolean) => void;
}

export const PurchaseOrderForm: React.FC<PurchaseOrderFormProps> = ({
  isDialogOpen,
  setIsDialogOpen,
}) => {
  const { data } = useAbstractOfQuotation();
  console.log(data);
  const abstracts = Array.isArray(data?.data) ? data.data : [];

  const { data: item_quotation } = useAllItemSelectedQuote();
  console.log(item_quotation);

  const itemQuotation = Array.isArray(item_quotation?.data)
    ? item_quotation.data
    : [];

  return (
    <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
      <DialogContent className="max-w-full w-[60rem]">
        <DialogHeader>
          <DialogTitle className="text-2xl">Confirm Order</DialogTitle>
        </DialogHeader>
        {abstracts.map((data) => (
          <div className="flex gap-20">
            <div>
              <p><span className="font-semibold">Purchase Number:</span> {data.pr_details.pr_no}</p>
              <p><span className="font-semibold">Requisitioner: </span>{data.pr_details.requested_by} </p>
              <p><span className="font-semibold">Status:</span> {data.pr_details.status}</p>
              <p><span className="font-semibold">Mode of Procurement:</span>Sample</p>
            </div>
            <div>
              <p><span className="font-semibold">Supplier Name: </span>{data.rfq_details.supplier_name}</p>
              <p><span className="font-semibold">Supplier Address: </span>{data.rfq_details.supplier_address}</p>
              <p><span className="font-semibold">TIN: </span>{data.rfq_details.tin}</p>
              <p>{data.rfq_details.is_VAT ? "VAT" : "non-VAT"}</p>
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
          {itemQuotation.map((data, index) => (
            <div className="grid grid-cols-6 gap-2 mb-4 items-center p-2  border-b-2">
              <p>{index + 1}</p>
              <p>{data.item_details.item_details.unit}</p>
              <p className="col-span-2">
                {data.item_details.item_details.item_description}
              </p>
              <p>{data.item_details.item_details.quantity}</p>
              <p>{data.item_details.item_details.unit_cost}</p>
              
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
          <Button className="text-base">
            <ShoppingCart className="mr-2" />
            Confirm Order
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
