import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from "@/components/ui/card";
import { formatDate } from "@/services/formatDate";
import { CheckIcon, Cross2Icon, Pencil2Icon } from "@radix-ui/react-icons";
import { PrinterIcon } from "lucide-react";
import { useParams } from "react-router-dom";
import Loading from "../../shared/components/Loading";
import { useAllItemSelectedQuote, useGetAbstractOfQuotation } from "@/services/AbstractOfQuotationServices";
import { Checkbox } from "@/components/ui/checkbox";
import { generateAOQPDF } from "@/services/generateAOQPDF";
import { AbstractFormEdit } from "./AbstractFormEdit";

export const AbstractItemContentList = () => {
  const [isDialogOpen, setIsDialogOpen] = useState<boolean>(false)
  const { aoq_no } = useParams();

  const { data: abstract, isLoading: abstract_loading } = useGetAbstractOfQuotation(aoq_no!);
  const { data:items, isLoading  } = useAllItemSelectedQuote()

  const abstractItems = items?.data?.filter((data) => data.afq === aoq_no);
  const quotation = abstract && abstract.data;
  console.log(abstractItems)
  if (isLoading || abstract_loading) return <Loading />;

  const handleOpenDialog = () => {
    setIsDialogOpen(true)
  }

  const handlePDFPrint = async () => {
    const url = await generateAOQPDF(abstractItems!)
    return window.open(url!, '_blank')
  }

  return (
    <div className=" w-full pt-8">
      <div className="">
        <Card className="">
          <CardHeader className="bg-orange-100 rounded-t">
            <div className="flex justify-between items-end ">
              <div>
                <p className="text-xl">
                  {quotation?.rfq_details.supplier_name}
                </p>
                <p className="text-sm">
                  {formatDate(quotation?.created_at as Date)}
                </p>
                <p className="text-base">
                  {quotation?.rfq_details.supplier_address}
                </p>
                <p className="text-base">{quotation?.rfq_details.tin}</p>
                <div className="flex items-center justify-center gap-2">
                <span> 
                    non-VAT <Checkbox checked={!quotation?.rfq_details.is_VAT} disabled/>
                  </span>
                  <span>
                    VAT <Checkbox checked={quotation?.rfq_details.is_VAT} disabled/>
                  </span>
                </div>
              </div>
              <div className="flex gap-2 ">
                <Button>
                  <Pencil2Icon onClick={handleOpenDialog} width={20} height={20} className="mx-2" /> Edit
                </Button>
                <Button variant={"outline"}>
                  <PrinterIcon onClick={handlePDFPrint} width={20} height={20} className="mx-2" />
                  Print
                </Button>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <p className="text-xl py-2">Abstract of Qoutations</p>
            <div className="grid grid-cols-8 gap-2 items-center py-2  border-b-2 sticky bg-background top-0">
              <p className="text-base">No.</p>
              <p className="text-base col-span-2">ITEM DESCRIPTION</p>
              <p className="text-base">QUANTITY</p>
              <p className="text-base">PRICE</p>
              <p className="text-base col-span-2">WINNING BIDDER</p>
              <p className="text-base">WINNING PRICE</p>
            </div>
            {abstractItems && abstractItems?.length > 0 ? (
              abstractItems?.map((item, index) => {
                return (
                  <div
                    className="grid grid-cols-8 gap-2 items-center py-8 border-b-2"
                    key={item.item_details.item_details.item_no}
                  >
                    <p className="text-gray-500">{index + 1}</p>
                    <p className="text-gray-500 col-span-2">
                      {item.item_details.item_details.item_description}
                    </p>
                    <p className="text-gray-500">
                      {item.item_details.item_details.quantity}
                    </p>
                    <p className="text-gray-500">
                      {item.item_details.item_details.unit_cost}
                    </p>

                    <p className="text-gray-500 col-span-2">
                      {item.rfq_details.supplier_name}
                    </p>

                    <p
                      className={`${
                        item.item_details.is_low_price ? "text-green-400" : "text-red-400"
                      } flex gap-2 items-center`}
                    >
                      {item.item_details.is_low_price ? <CheckIcon /> : <Cross2Icon />}
                      {item.item_details.unit_price}
                    </p>
                  </div>
                );
              })
            ) : (
              <p>No items Found</p>
            )}
          </CardContent>
          <CardFooter></CardFooter>
        </Card>
      </div>
      <AbstractFormEdit isDialogOpen={isDialogOpen} setIsDialogOpen={setIsDialogOpen}/>
    </div>
  );
};
