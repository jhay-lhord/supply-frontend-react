import { useParams } from "react-router-dom";
import {
  FilteredItemInPurchaseRequest,
  arraySort,
} from "@/services/itemServices";
import { usePurchaseRequestList } from "@/services/purchaseRequestServices";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  PurchaseRequestData,
  purchaseRequestFormSchema,
} from "@/types/request/purchase-request";
import { itemType } from "@/types/response/item";
import { useEffect } from "react";
import Loading from "../../shared/components/Loading";

import { DownloadIcon, Printer, SendIcon } from "lucide-react";
import {
  Tooltip,
  TooltipProvider,
  TooltipTrigger,
  TooltipContent,
} from "@/components/ui/tooltip";
import { Badge } from "@/components/ui/badge";
import {
  useRequestForQoutationCount,
} from "@/services/requestForQoutationServices";
import { Separator } from "@/components/ui/separator";
import { TwoStepRFQForm } from "./TwoStepRFQForm";

export default function PurchaseRequestItemList() {
  const [isDialogOpen, setIsDialogOpen] = useState<boolean>(false);
  const { pr_no } = useParams();
  const items = FilteredItemInPurchaseRequest(pr_no!);
  const {
    isLoading,
    data: purchase_request,
    error,
  } = usePurchaseRequestList(pr_no!);

  const rfqCount = useRequestForQoutationCount(pr_no!);

  const { setValue } = useForm<PurchaseRequestData>({
    resolver: zodResolver(purchaseRequestFormSchema),
    defaultValues: {
      pr_no: pr_no,
      purpose: purchase_request?.data?.purpose,
      status: purchase_request?.data?.status,
      res_center_code: purchase_request?.data?.res_center_code,
      requested_by: purchase_request?.data?.requested_by,
      approved_by: purchase_request?.data?.approved_by,
    },
  });

  useEffect(() => {
    if (purchase_request?.data) {
      setValue("purpose", purchase_request.data.purpose || "");
      setValue("res_center_code", purchase_request.data.res_center_code || "");
      setValue("requested_by", purchase_request.data.requested_by || "");
      setValue("approved_by", purchase_request.data.approved_by || "");
      setValue("status", purchase_request.data.status);
    }
  }, [purchase_request, setValue]);

  const sortedItems = arraySort(items!, "stock_property_no");

  if (isLoading) return <Loading />;
  if (error) return <div>{error.message}</div>;

  const handleAddRFQ = () => {
    setIsDialogOpen(true);
  };

  return (
    <div className="m-8 bg-slate-100  rounded-md">
      <div className="flex place-content-between items-end py-2 rounded-md bg-orange-100">
        <div className="flex flex-col gap-1 p-8">
          <p>
            <span className="font-medium text-lg">PR Number: </span>
            <span className="text-red-400">{pr_no}</span>
          </p>
          <p className="flex items-center gap-2">
            <span className="font-medium text-lg">Status: </span>
            <Badge
              variant="destructive"
              className="bg-orange-300 text-slate-950 hover:bg-orange-200"
            >
              {purchase_request?.data?.status}
            </Badge>
          </p>
          <p>
            <span className="font-medium text-lg">Requested By: </span>
            <span className="">{purchase_request?.data?.requested_by}</span>
          </p>
          <p>
            <span className="font-medium text-lg">Purpose: </span>
            <span className="">{purchase_request?.data?.purpose}</span>
          </p>
          <p className="flex items-center gap-2">
            <div className="relative">
              <span className="font-medium text-lg">Request of Qoutation:</span>
              <Button className="mx-2" variant="outline">
                View
              </Button>
              <Badge className="absolute -top-2 -right-2">{rfqCount}</Badge>
            </div>
          </p>
        </div>
        <div className="flex gap-4 p-8">
          <Button
            onClick={handleAddRFQ}
            variant={"outline"}
            className="bg-slate-100"
          >
            Create RFQ
          </Button>

          <TooltipProvider delayDuration={100} skipDelayDuration={200}>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button className="px-7 bg-orange-300 hover:bg-orange-200 text-slate-950">
                  <Printer strokeWidth={1.3} />
                </Button>
              </TooltipTrigger>
              <TooltipContent side="top">Print Empty RFQ Form</TooltipContent>
            </Tooltip>

            <Tooltip>
              <TooltipTrigger asChild>
                <Button className="px-7 bg-orange-300 hover:bg-orange-200 text-slate-950">
                  <DownloadIcon strokeWidth={1.3} />
                </Button>
              </TooltipTrigger>
              <TooltipContent side="top">Download RFQ Form</TooltipContent>
            </Tooltip>

            <Tooltip>
              <TooltipTrigger asChild>
                <Button className="px-7 bg-orange-300 hover:bg-orange-200 text-slate-950">
                  <SendIcon strokeWidth={1.3} />
                </Button>
              </TooltipTrigger>
              <TooltipContent side="top">Send RFQ Form</TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </div>
      </div>
      <Separator className="" />
      {isLoading ? <Loading /> : <ItemList sortedItems={sortedItems!} />}

      <TwoStepRFQForm
        isDialogOpen={isDialogOpen}
        setIsDialogOpen={setIsDialogOpen}
      />
    </div>
  );
}

const ItemList = ({ sortedItems }: { sortedItems: itemType[] }) => {
  return (
    <div className="border-none  mt-4 px-8">
      <p className="font-bold">Items</p>
      <div className="grid grid-cols-6 gap-2 mb-4 items-center border-b-2 py-4">
        <Label className="text-base">Stock Property No.</Label>
        <Label className="text-base">Unit</Label>
        <Label className="text-base">Description</Label>
        <Label className="text-base">Quantity</Label>
        <Label className="text-base">Unit Cost</Label>
        <Label className="text-base">Total Cost</Label>
      </div>
      {sortedItems?.length ? (
        sortedItems.map((item) => (
          <div
            key={item.item_no}
            className="grid grid-cols-6 gap-2 mb-4 items-center p-2  border-b-2"
          >
            <Label className="text-gray-500">{item.stock_property_no}</Label>
            <Label className="text-gray-500">{item.unit}</Label>
            <Label className="text-gray-500">{item.item_description}</Label>
            <Label className="text-gray-500">{item.quantity}</Label>
            <Label className="text-gray-500">{item.unit_cost}</Label>
            <Label className="text-gray-500">{item.total_cost}</Label>
          </div>
        ))
      ) : (
        <Loading />
      )}
    </div>
  );
};
