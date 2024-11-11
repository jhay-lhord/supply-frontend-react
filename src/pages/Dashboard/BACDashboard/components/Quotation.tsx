import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from "@/components/ui/card";
import { CheckIcon, Cross2Icon } from "@radix-ui/react-icons";
import {
  useGetItemQuotation,
  useGetRequestForQuotation,
} from "@/services/requestForQoutationServices";
import { formatDate } from "@/services/formatDate";
import Loading from "../../shared/components/Loading";
import { useParams } from "react-router-dom";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { PenBoxIcon, PrinterIcon } from "lucide-react";
import { RFQFormEdit } from "./RFQFormEdit";
import { useState } from "react";

export const Quotation = () => {
  const [isDialogOpen, setIsDialogOpen] = useState<boolean>(false);
  const { rfq_no } = useParams();

  const { data, isLoading: item_loading } = useGetRequestForQuotation(rfq_no!);
  const { data: items, isLoading } = useGetItemQuotation();

  const itemQuotation = items?.data?.filter((data) => data.rfq === rfq_no);
  const quotation = data && data.data;
  
  if (isLoading || item_loading) return <Loading />;

  return (
    <div className=" w-full pt-8">
      <div className="">
        <Card className="">
          <CardHeader>
            <div className="flex justify-between items-end ">
              <div>
                <p className="text-xl">{quotation?.supplier_name}</p>
                <p className="text-sm">
                  {formatDate(quotation?.created_at as Date)}
                </p>
                <p className="text-base">{quotation?.supplier_address}</p>
                <p className="text-base">
                  {quotation?.is_VAT ? "VAT" : "non-VAT"}
                </p>
                <p className="text-base"></p>
              </div>
              <div className="flex gap-2 ">
                <Button onClick={() => setIsDialogOpen(true)}>
                  <PenBoxIcon width={20} height={20} className="mx-2" /> Edit
                </Button>
                <Button variant={"outline"}>
                  <PrinterIcon width={20} height={20} className="mx-2" />
                  Print
                </Button>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <p>Qoutations</p>
            <div className="grid grid-cols-7 gap-2 items-center p-2  border-b-2 sticky bg-background top-0">
              <Label>Unit</Label>
              <Label>Item Description</Label>
              <Label>Quantity</Label>
              <Label>Unit Cost</Label>
              <Label className="col-span-2">Brand / Model</Label>
              <Label>Unit Price </Label>
            </div>
            {itemQuotation && itemQuotation?.length > 0 ? (itemQuotation
              ?.map((item) => {
                return (
                  <div className="grid grid-cols-7 gap-2 items-center py-8 border-b-2" key={item.item_details.item_no}>
                    <Label className="text-gray-500">{item.item_details.unit}</Label>
                    <Label className="text-gray-500">
                      {item.item_details.item_description}
                    </Label>
                    <Label className="text-gray-500">
                      {item.item_details.quantity}
                    </Label>
                    <Label className="text-gray-500">
                      {item.item_details.unit_cost}
                    </Label>

                    <Label className="text-gray-500 col-span-2">
                      {item.brand_model}
                    </Label>

                    <Label
                      className={`${
                        item.is_low_price ? "text-green-400" : "text-red-400"
                      } flex gap-2 items-center`}
                    >
                      {item.is_low_price ? <CheckIcon /> : <Cross2Icon />}
                      {item.unit_price}
                    </Label>
                  </div>
                );
              })) : (<Loading/>)}
          </CardContent>
          <CardFooter>
          </CardFooter>
        </Card>
      </div>
      <RFQFormEdit
        isDialogOpen={isDialogOpen}
        setIsDialogOpen={setIsDialogOpen}
        itemQuotation={itemQuotation!}
        quotation={quotation!}
      />
    </div>
  );
};
