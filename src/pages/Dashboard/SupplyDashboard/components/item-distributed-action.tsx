import { Button } from "@/components/ui/button";
import {
  Tooltip,
  TooltipProvider,
  TooltipTrigger,
  TooltipContent,
} from "@/components/ui/tooltip";
import { purchaseRequestType } from "@/types/response/puchase-request";
import { abstractType_ } from "@/types/response/abstract-of-quotation";
import { FileText } from "lucide-react";
import { generateRISPDF } from "@/utils/generateRISPDF";
import { useGetItemsDeliveredInPurchaseRequest } from "@/services/puchaseOrderServices";
import { useMemo, useState } from "react";
import GenerateICSPDFDialog from "./ItemDistributeDialog";

interface ItemDistributionActionsProps {
  pr_no: string;
  _data: purchaseRequestType | abstractType_;
}

export const ItemDistributedActions = ({
  _data,
  pr_no,
}: ItemDistributionActionsProps) => {
  const [isDialogOpen, setIsDialogOpen] = useState<boolean>(false);
  const { data: item_delivered } =
    useGetItemsDeliveredInPurchaseRequest({ pr_no: pr_no });
  console.log(item_delivered);

  const itemsDeliveredData = useMemo(() => {
    return Array.isArray(item_delivered?.data) ? item_delivered.data : [];
  }, [item_delivered?.data]);
  console.log(itemsDeliveredData);

  const filteredItemsDeliveredData = useMemo(() => {
    return itemsDeliveredData.filter(
      (data) => data.pr_details.status === "Completed"
    );
  }, [itemsDeliveredData]);

  console.log(_data);
  const handleGenerateRISPDF = async () => {
    const url = await generateRISPDF(itemsDeliveredData);
    window.open(url, "_blank");
  };
  return (
    <>
      <TooltipProvider delayDuration={100} skipDelayDuration={200}>
        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              className="bg-green-200 hover:bg-green-300"
              onClick={() => setIsDialogOpen(true)}
            >
              <FileText width={20} height={20} className="mx-2" />ICS
              PDF
            </Button>
          </TooltipTrigger>
          <TooltipContent side="top">Click to Generate ICS PDF</TooltipContent>
        </Tooltip>
        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              className="bg-green-200 hover:bg-green-300"
              onClick={handleGenerateRISPDF}
            >
              <FileText width={20} height={20} className="mx-2" />RIS
              PDF
            </Button>
          </TooltipTrigger>
          <TooltipContent side="top">Click to Generate RIS PDF</TooltipContent>
        </Tooltip>
      </TooltipProvider>
      <GenerateICSPDFDialog
        itemsDeliveredData={filteredItemsDeliveredData}
        isOpen={isDialogOpen}
        setIsOpen={setIsDialogOpen}
      />
    </>
  );
};
