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
import PurchaseRequestForm from "./PurchaseRequestForm";
import { itemType } from "@/types/response/item";
import { useEffect } from "react";
import Loading from "../../shared/components/Loading";

export default function PurchaseRequestItemList() {
  const [isDialogOpen, setIsDialogOpen] = useState<boolean>(false);
  const { pr_no } = useParams();
  const items = FilteredItemInPurchaseRequest(pr_no!);
  const {
    isLoading,
    data: purchase_request,
    error,
  } = usePurchaseRequestList(pr_no!);

  const {
    setValue,
  } = useForm<PurchaseRequestData>({
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

  let sortedItems;
  if (!isLoading) {
    sortedItems = arraySort(items!, "stock_property_no");
  }

  if (isLoading) return <Loading />;
  if (error) return <div>{error.message}</div>;

  return (
    <div className="m-8">
      <div className="flex place-content-between items-center py-2">
        <div>
          <p>
            <span className="font-bold text-lg">PR Number: </span> {pr_no}
          </p>
          <p>
            <span className="font-bold text-lg">Status: </span>
            {purchase_request?.data?.status}
          </p>
        </div>
        <Button className="px-7 bg-orange-200 hover:bg-orange-300 text-slate-950">
          Print PR
        </Button>
      </div>
      <form className="border-none rounded bg-slate-100 p-8">
        <div className="grid grid-cols-5 gap-4 py-2">
          <div className="flex flex-col">
            <Label className="text-base ">Res Center Code</Label>
            <Label className="text-sm mt-4 text-gray-500">
              {purchase_request?.data?.res_center_code}
            </Label>
          </div>

          <div className="flex flex-col">
            <Label className="text-base ">Purpose</Label>
            <Label className="text-sm mt-4 text-gray-500">{purchase_request?.data?.purpose}</Label>
          </div>

          <div className="flex flex-col">
            <Label className="text-base ">Requested By</Label>
            <Label className="text-sm mt-4 text-gray-500">
              {purchase_request?.data?.requested_by}
            </Label>
          </div>

          <div className="flex flex-col">
            <Label className="text-base ">Approved By</Label>
            <Label className="text-sm mt-4 text-gray-500">
              {purchase_request?.data?.approved_by}
            </Label>
          </div>

          <div className="flex flex-col">
            <Label className="text-base ">Status</Label>
            <Label className="text-sm mt-4 text-gray-500">
              {purchase_request?.data?.status}
            </Label>{" "}
          </div>
        </div>
      </form>

      <ItemList sortedItems={sortedItems!} />

      <PurchaseRequestForm
        isDialogOpen={isDialogOpen}
        setIsDialogOpen={setIsDialogOpen}
        lastPrNo={pr_no!}
      />
    </div>
  );
}

const ItemList = ({ sortedItems }: { sortedItems: itemType[] }) => {
  return (
    <div className="border-none rounded mt-4 p-8 bg-slate-100">
      <p className="font-bold pt-5">Items</p>
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
        <div className="w-full flex items-center flex-col">
          <img src="/empty-box.svg" className="w-80 h-80" alt="Empty box" />
          <p>It looks a bit empty here! Start by adding a new item.</p>
        </div>
      )}
    </div>
  );
};
