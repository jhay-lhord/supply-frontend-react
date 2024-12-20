import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { formatDate } from "@/services/formatDate";
import { CheckIcon, Cross2Icon } from "@radix-ui/react-icons";
import {
  BuildingIcon,
  CalendarIcon,
  ClipboardIcon,
  CreditCardIcon,
  Loader2,
  MapPinIcon,
  PrinterIcon,
} from "lucide-react";
import { useParams } from "react-router-dom";
import Loading from "../../shared/components/Loading";
import {
  useGetAbstractOfQuotation,
  useGetAllSupplierItem,
} from "@/services/AbstractOfQuotationServices";
import { generateAOQPDF } from "@/services/generateAOQPDF";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Dialog } from "@radix-ui/react-dialog";
import {
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useGetRequestForQuotation } from "@/services/requestForQoutationServices";

export const AbstractItemContentList = () => {
  const [isInformationDialogOpen, setIsInformationDialogOpen] =
    useState<boolean>(false);
  const [rfqNo, setRfqNo] = useState<string | undefined>(undefined);

  const { aoq_no } = useParams();

  const { data: abstract, isLoading: abstract_loading } =
    useGetAbstractOfQuotation(aoq_no!);
  const { data: items, isLoading } = useGetAllSupplierItem();

  const supplierItemData = Array.isArray(items?.data) ? items.data : [];

  const abstractData = abstract && abstract.data;

  if (isLoading || abstract_loading) return <Loading />;

  const handlePDFPrint = async () => {
    const url = await generateAOQPDF(supplierItemData!);
    return window.open(url!, "_blank");
  };

  const handleOpenSupplierInformation = (rfq_no: string) => {
    setIsInformationDialogOpen(true);
    setRfqNo(rfq_no);
  };

  return (
    <div className="w-full">
      <Card className="w-full bg-slate-100">
        <CardHeader className="flex flex-col">
          <CardTitle className="">
            <div>
              <div className="flex items-center justify-between">
                <div className="">
                  <p className="font-thin">{abstractData?.aoq_no}</p>
                  <div className="flex items-center pt-2">
                    <CalendarIcon className="w-3 h-3 mr-1" />
                    <p className="text-sm font-thin">
                      {abstractData?.created_at &&
                        formatDate(abstractData?.created_at)}
                    </p>
                  </div>
                </div>

                <div className="flex gap-4">
                  <Button onClick={handlePDFPrint}>
                    <PrinterIcon width={20} height={20} className="mx-2" />
                    Generate PDF
                  </Button>
                </div>
              </div>
              <Separator className="mt-3" />
            </div>
          </CardTitle>
        </CardHeader>
        <CardContent className="border-2 mx-6 p-4 rounded-md">
          <div className="flex gap-2 item-center">
            <ClipboardIcon className="h-6 w-6" />
            <p className="text-xl">Abstract of Qoutations</p>
          </div>
          <div className="grid grid-cols-8 gap-2 items-center py-2  border-b-2 sticky top-0">
            <p className="text-base">No.</p>
            <p className="text-base col-span-2">ITEM DESCRIPTION</p>
            <p className="text-base">QUANTITY</p>
            <p className="text-base">PRICE</p>
            <p className="text-base col-span-2">WINNING BIDDER</p>
            <p className="text-base">WINNING PRICE</p>
          </div>
          {supplierItemData && supplierItemData?.length > 0 ? (
            supplierItemData?.map((item, index) => {
              return (
                <div
                  className="grid grid-cols-8 gap-2 items-center py-6 border-b-2"
                  key={item.item_quotation_details.item_details.item_no}
                >
                  <p className="text-gray-500">{index + 1}</p>
                  <p className="text-gray-500 col-span-2">
                    {item.item_quotation_details.item_details.item_description}
                  </p>
                  <p className="text-gray-500">
                    {item.item_quotation_details.item_details.quantity}
                  </p>
                  <p className="text-gray-500">
                    {item.item_quotation_details.item_details.unit_cost}
                  </p>

                  <p
                    className="text-gray-500 col-span-2 underline hover:cursor-pointer"
                    onClick={() =>
                      handleOpenSupplierInformation(item.rfq_details.rfq_no)
                    }
                  >
                    {item.rfq_details.supplier_name}
                  </p>

                  <p
                    className={`${
                      item.item_quotation_details.is_low_price
                        ? "text-green-400"
                        : "text-red-400"
                    } flex gap-2 items-center`}
                  >
                    {item.item_quotation_details.is_low_price ? (
                      <CheckIcon />
                    ) : (
                      <Cross2Icon />
                    )}
                    {item.item_quotation_details.unit_price}
                  </p>
                </div>
              );
            })
          ) : (
            <p>No items Found</p>
          )}
        </CardContent>
        <CardFooter className="flex justify-between"></CardFooter>
      </Card>

      <SupplierInformation
        rfqNo={rfqNo!}
        isInformationDialogOpen={isInformationDialogOpen}
        setIsInformationDialogOpen={setIsInformationDialogOpen}
      />
    </div>
  );
};
interface SupplierInformationProps {
  isInformationDialogOpen: boolean;
  setIsInformationDialogOpen: (open: boolean) => void;
  rfqNo: string;
}

export const SupplierInformation: React.FC<SupplierInformationProps> = ({
  rfqNo,
  isInformationDialogOpen,
  setIsInformationDialogOpen,
}) => {
  const { data, isLoading } = useGetRequestForQuotation(rfqNo);
  const rfqData = data?.data;

  return (
    <Dialog
      open={isInformationDialogOpen}
      onOpenChange={setIsInformationDialogOpen}
    >
      <DialogHeader>
        <DialogTitle></DialogTitle>
      </DialogHeader>
      <DialogContent>
        {isLoading ? (
          <p className="flex">
            <Loader2 className="animate-spin mx-2" /> Loading...
          </p>
        ) : (
          <div className="flex flex-col gap-3">
            <div className="flex items-center">
              <BuildingIcon className="w-5 h-5 mr-1" />
              <p className="text-lg font-thin">{rfqData?.supplier_name}</p>
            </div>
            <Separator />
            <div className="flex items-center">
              <MapPinIcon className="w-5 h-5 mr-1" />
              <p className="text-lg font-thin">{rfqData?.supplier_address}</p>
            </div>
            <Separator />
            <div className="flex items-center">
              <CreditCardIcon className="w-4 h-4 mr-1" />
              <p className="text-lg font-thin">{rfqData?.tin}</p>
            </div>
            <Separator />
            <Badge variant={"outline"} className="flex items-center">
              <p className="text-lg font-thin">
                {rfqData?.is_VAT ? "VAT" : "non-VAT"}
              </p>
            </Badge>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
};
