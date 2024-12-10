import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { CheckIcon, Cross2Icon } from "@radix-ui/react-icons";
import {
  useGetItemQuotation,
  useGetRequestForQuotation,
} from "@/services/requestForQoutationServices";
import { formatDate } from "@/services/formatDate";
import Loading from "../../shared/components/Loading";
import { useParams } from "react-router-dom";
import { Button } from "@/components/ui/button";
import {
  CalendarIcon,
  ClipboardIcon,
  CreditCardIcon,
  MapPinIcon,
  PenBoxIcon,
  PrinterIcon,
} from "lucide-react";
import { RFQFormEdit } from "./RFQFormEdit";
import { generateRFQPDF } from "@/services/generateRFQPDF";
import { useState } from "react";
import { Separator } from "@/components/ui/separator";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Badge } from "@/components/ui/badge";

export const Quotation = () => {
  const [isDialogOpen, setIsDialogOpen] = useState<boolean>(false);
  const { rfq_no } = useParams();

  const { data, isLoading: item_loading } = useGetRequestForQuotation(rfq_no!);
  const { data: items, isLoading } = useGetItemQuotation();

  const itemQuotation = items?.data?.filter((data) => data.rfq === rfq_no);
  const quotation = data && data.data;
  const handlePrint = async () => {
    const url = await generateRFQPDF(itemQuotation!);
    return window.open(url, "_blank");
  };

  if (isLoading || item_loading) return <Loading />;

  return (
    <div className="m-6 w-full">
      <Card className="w-full bg-slate-100">
        <CardHeader className="flex flex-col">
          <CardTitle className="">
            <div>
              <div className="flex items-center justify-between">
                <div className="">
                  <p className="font-thin">{quotation?.supplier_name}</p>
                  <div className="flex items-center pt-2">
                    <CalendarIcon className="w-3 h-3 mr-1" />
                    <p className="text-base font-thin">
                      {quotation?.created_at &&
                        formatDate(quotation?.created_at)}
                    </p>
                  </div>
                </div>

                <div className="flex gap-4">
                  <TooltipProvider delayDuration={100} skipDelayDuration={200}>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Button onClick={() => setIsDialogOpen(true)}>
                          <PenBoxIcon width={20} height={20} className="mx-2" />{" "}
                          Edit
                        </Button>
                      </TooltipTrigger>
                      <TooltipContent side="top">
                        Edit RFQ Details
                      </TooltipContent>
                    </Tooltip>

                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Button variant={"outline"} onClick={handlePrint}>
                          <PrinterIcon
                            width={20}
                            height={20}
                            className="mx-2"
                          />
                          Print
                        </Button>
                      </TooltipTrigger>
                      <TooltipContent side="top">Print RFQ Form</TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                </div>
              </div>
              <Separator className="mt-3" />
              <div className="flex items-center gap-4 mt-2">
                <div className="flex items-center">
                  <MapPinIcon className="w-4 h-4 mr-1" />
                  <p className="text-lg font-thin">
                    {quotation?.supplier_address}
                  </p>
                </div>
                <Separator orientation="vertical" className="h-6" />
                <div className="flex items-center">
                  <CreditCardIcon className="w-4 h-4 mr-1" />
                  <p className="text-lg font-thin">{quotation?.tin}</p>
                </div>
                <Separator orientation="vertical" className="h-6" />
                <Badge variant={"outline"} className="flex items-center">
                  <p className="text-lg font-thin">
                    {quotation?.is_VAT ? "VAT" : "non_VAT"}
                  </p>
                </Badge>
              </div>
            </div>
            <div className="mb-5">
              <div className="flex justify-end gap-1"></div>
            </div>
          </CardTitle>
        </CardHeader>
        <CardContent className="border-2 mx-6 rounded-md p-4 ">
          <div className=" my-2 flex gap-3 items-center">
            <ClipboardIcon className="h-6 w-6" />
            <p className="text-xl">Qoutations</p>
          </div>
          <div className="grid grid-cols-8 gap-2 items-center py-2  border-b-2 sticky top-0">
            <p className="text-base">UNIT</p>
            <p className="text-base col-span-2">ITEM DESCRIPTION</p>
            <p className="text-base">QUANTITY</p>
            <p className="text-base">UNIT COST</p>
            <p className="text-base col-span-2">BRAND / MODEL</p>
            <p className="text-base">UNIT PRICE</p>
          </div>
          {itemQuotation && itemQuotation?.length > 0 ? (
            itemQuotation?.map((item) => {
              return (
                <div
                  className="grid grid-cols-8 gap-2 items-center py-6 border-b-2"
                  key={item.item_details.item_no}
                >
                  <p className="text-gray-500">{item.item_details.unit}</p>
                  <p className="text-gray-500 col-span-2">
                    {item.item_details.item_description}
                  </p>
                  <p className="text-gray-500">{item.item_details.quantity}</p>
                  <p className="text-gray-500">{item.item_details.unit_cost}</p>

                  <p className="text-gray-500 col-span-2">{item.brand_model}</p>

                  <p
                    className={`${
                      item.is_low_price ? "text-green-400" : "text-red-400"
                    } flex gap-2 items-center`}
                  >
                    {item.is_low_price ? <CheckIcon /> : <Cross2Icon />}
                    {item.unit_price}
                  </p>
                </div>
              );
            })
          ) : (
            <Loading />
          )}
        </CardContent>
        <CardFooter className="flex justify-between"></CardFooter>
      </Card>
      <RFQFormEdit
        isDialogOpen={isDialogOpen}
        setIsDialogOpen={setIsDialogOpen}
        itemQuotation={itemQuotation!}
        quotation={quotation!}
      />
    </div>
  );
};
