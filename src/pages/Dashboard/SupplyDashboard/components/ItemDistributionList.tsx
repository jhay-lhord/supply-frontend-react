import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { formatDate } from "@/services/formatDate";
import Loading from "../../shared/components/Loading";
import { useNavigate, useParams } from "react-router-dom";
import { Button } from "@/components/ui/button";
import {
  ArrowLeftIcon,
  CalendarIcon,
  ClipboardIcon,
  CreditCardIcon,
  FileText,
  Loader2,
  MapPinIcon,
  MoveHorizontal,
} from "lucide-react";
import { useMemo, useState } from "react";
import { Separator } from "@/components/ui/separator";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { useGetItemsDeliveredInPurchaseRequest } from "@/services/puchaseOrderServices";
import GenerateICSPDFDialog from "./ItemDistributeDialog";
import Layout from "./Layout/SupplyDashboardLayout";
// import { generateRISPDF } from "@/utils/generateRISPDF";
import { usePurchaseRequestActions } from "@/services/purchaseRequestServices";
import { MessageDialog } from "../../shared/components/MessageDialog";
import { generateIARPDF } from "@/utils/generateIARPDF";

interface messageDialogProps {
  open: boolean;
  message: string;
  type: "success" | "error" | "info";
  title: string;
}

export const ItemDistributionList = () => {
  const [messageDialog, setMessageDialog] = useState<messageDialogProps>({
    open: false,
    type: "success" as const,
    title: "",
    message: "",
  });
  const navigate = useNavigate();
  const { pr_no } = useParams();
  const [isDialogOpen, setIsDialogOpen] = useState<boolean>(false);

  const { handleDistribute, isError, isSuccess, isPendingDistribute } =
    usePurchaseRequestActions();
  const { data: item_delivered, isLoading: isItemsDeliveredLoading } =
    useGetItemsDeliveredInPurchaseRequest({ pr_no: pr_no });
  console.log(item_delivered);

  const itemsDeliveredData = useMemo(() => {
    return Array.isArray(item_delivered?.data) ? item_delivered.data : [];
  }, [item_delivered?.data]);
  console.log(itemsDeliveredData);

  const filteredItemsDeliveredData = useMemo(() => {
    return itemsDeliveredData.filter(
      (data) => data.pr_details.status === "Ready for Distribution"
    );
  }, [itemsDeliveredData]);

  console.log(filteredItemsDeliveredData)

  if (isItemsDeliveredLoading) return <Loading />;

  const handleGenerateIARPDF = async () => {
    const url = await generateIARPDF(filteredItemsDeliveredData)
    window.open(url, "_blank");
  }

  const handleDistributeClick = async () => {
    await handleDistribute(pr_no!);
    if (isSuccess) {
      setMessageDialog({
        open: true,
        message: "Distributed Successfully ",
        title: "Success",
        type: "success",
      });
    }

    if (isError) {
      setMessageDialog({
        open: true,
        message: "Something went wrong, Please try again later",
        title: "Error",
        type: "error",
      });
    }
  };

  return (
    <Layout>
      <div className=" w-full">
        <Button className="mb-2" onClick={() => navigate(-1)}>
          <span className="flex gap-2 items-center">
            <ArrowLeftIcon className="h-5 w-5" />
            <p>Back</p>
          </span>
        </Button>
        <Card className="w-full bg-slate-100">
          <CardHeader className="flex flex-col">
            <CardTitle className="">
              <div>
                <div className="flex items-center justify-between">
                  <div className="">
                    <p className="font-thin">
                      {filteredItemsDeliveredData &&
                        filteredItemsDeliveredData.length > 0 &&
                        filteredItemsDeliveredData[0].pr_details.pr_no}
                    </p>
                    <div className="flex items-center pt-2">
                      <CalendarIcon className="w-3 h-3 mr-1" />
                      <p className="text-base font-thin">
                        {filteredItemsDeliveredData[0]?.created_at &&
                          formatDate(filteredItemsDeliveredData[0]?.created_at)}
                      </p>
                    </div>
                  </div>

                  <div className="flex gap-4">
                    <TooltipProvider
                      delayDuration={100}
                      skipDelayDuration={200}
                    >
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <Button onClick={handleDistributeClick}>
                            {isPendingDistribute ? (
                              <Loader2 className="animate-spin" />
                            ) : (
                              "Distribute"
                            )}
                            <MoveHorizontal
                              width={20}
                              height={20}
                              className="mx-2"
                            />{" "}
                          </Button>
                        </TooltipTrigger>
                        <TooltipContent side="top">
                          Click to distribute
                        </TooltipContent>
                      </Tooltip>
                    </TooltipProvider>
                  </div>
                </div>
                <Separator className="mt-3" />
                <div className="flex items-center gap-4 mt-2">
                  <div className="flex items-center">
                    <MapPinIcon className="w-4 h-4 mr-1" />
                    <p className="text-lg font-thin">
                      {
                        filteredItemsDeliveredData[0]?.pr_details
                          .requisitioner_details.name
                      }
                    </p>
                  </div>
                  <Separator orientation="vertical" className="h-6" />
                  <div className="flex items-center">
                    <CreditCardIcon className="w-4 h-4 mr-1" />
                    <p className="text-lg font-thin">
                      {filteredItemsDeliveredData[0]?.pr_details.purpose}
                    </p>
                  </div>
                </div>
                <div className="flex gap-4 mt-2">
                  <TooltipProvider delayDuration={100} skipDelayDuration={200}>
                    {/* <Tooltip>
                      <TooltipTrigger asChild>
                        <Button
                          className="bg-green-200 hover:bg-green-300"
                          onClick={() => setIsDialogOpen(true)}
                        >
                          <FileText width={20} height={20} className="mx-2" />{" "}
                          Generate ICS PDF
                        </Button>
                      </TooltipTrigger>
                      <TooltipContent side="top">
                        Click to Generate ICS PDF
                      </TooltipContent>
                    </Tooltip> */}
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Button
                          className="bg-green-200 hover:bg-green-300"
                          onClick={handleGenerateIARPDF}
                        >
                          <FileText width={20} height={20} className="mx-2" />{" "}
                          Generate IAR PDF
                        </Button>
                      </TooltipTrigger>
                      <TooltipContent side="top">
                        Click to Generate IAR PDF
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                </div>
              </div>
            </CardTitle>
          </CardHeader>
          <CardContent className="border-2 mx-6 rounded-md p-4 ">
            <div className=" my-2 flex gap-3 items-center">
              <ClipboardIcon className="h-6 w-6" />
              <p className="text-xl">Items Delivered</p>
            </div>
            <div className="grid grid-cols-8 gap-2 items-center py-2  border-b-2 sticky top-0">
              <p className="text-base">UNIT</p>
              <p className="text-base col-span-2">ITEM DESCRIPTION</p>
              <p className="text-base">QUANTITY</p>
              <p className="text-base">UNIT COST</p>
              <p className="text-base col-span-2">BRAND / MODEL</p>
              <p className="text-base">UNIT PRICE</p>
            </div>
            {filteredItemsDeliveredData &&
            filteredItemsDeliveredData?.length > 0 ? (
              filteredItemsDeliveredData?.map((item) => {
                return (
                  <div
                    className="grid grid-cols-8 gap-2 items-center py-6 border-b-2"
                    key={
                      item.item_details.item_quotation_details.item_details
                        .stock_property_no
                    }
                  >
                    <p className="text-gray-500">
                      {
                        item.item_details.item_quotation_details.item_details
                          .unit
                      }
                    </p>
                    <p className="text-gray-500 col-span-2">
                      {
                        item.item_details.item_quotation_details.item_details
                          .item_description
                      }
                    </p>
                    <p className="text-gray-500">
                      {
                        item.item_details.item_quotation_details.item_details
                          .quantity
                      }
                    </p>
                    <p className="text-gray-500">
                      {item.item_details.item_quotation_details.unit_price}
                    </p>

                    <p className="text-gray-500 col-span-2">
                      {item.item_details.item_quotation_details.brand_model}
                    </p>
                    <p className="text-gray-500 col-span-2">
                      {item.item_details.item_quotation_details.unit_price}
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
      </div>
      <GenerateICSPDFDialog
        itemsDeliveredData={filteredItemsDeliveredData}
        isOpen={isDialogOpen}
        setIsOpen={setIsDialogOpen}
      />
      <MessageDialog
        message={messageDialog?.message}
        title={messageDialog?.title}
        type={messageDialog?.type}
        open={messageDialog.open}
        onOpenChange={(open) => setMessageDialog((prev) => ({ ...prev, open }))}
      />
    </Layout>
  );
};
