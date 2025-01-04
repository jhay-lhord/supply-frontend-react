import { useState } from "react";
import { ArrowTopRightIcon } from "@radix-ui/react-icons";
import { Button } from "@/components/ui/button";
import {
  Tooltip,
  TooltipProvider,
  TooltipTrigger,
  TooltipContent,
} from "@/components/ui/tooltip";
import { purchaseRequestType } from "@/types/response/puchase-request";
import { abstractType_ } from "@/types/response/abstract-of-quotation";
import ItemDistributeDialog from "./ItemDistributeDialog";
import { FileText } from "lucide-react";

interface ItemDistributionActionsProps {
  pr_no: string;
  _data: purchaseRequestType | abstractType_;
}

export const ItemDistributionActions = ({
  _data,
  pr_no,
}: ItemDistributionActionsProps) => {
  const [isDialogOpen, setIsDialogOpen] = useState<boolean>(false);



  const handleDistibuteClick = () => {
    setIsDialogOpen(true);
    console.log(_data)
    console.log(pr_no)
  };

  return (
    <>
      <TooltipProvider delayDuration={100} skipDelayDuration={200}>
        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              onClick={handleDistibuteClick}
              variant={"outline"}
            >
              <p className="mx-1 text-xs font-thin">Generate PDF</p>
              <FileText className="h-4 w-4" />
              <span className="sr-only">Generate PDF</span>
            </Button>
          </TooltipTrigger>
          <TooltipContent side="top">Generate PDF</TooltipContent>
        </Tooltip>
        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              onClick={handleDistibuteClick}
              className=" mx-2 bg-orange-200 data-[state=open]:bg-muted hover:rounded-full"
            >
              <p className="mx-1 text-xs font-thin">Open</p>
              <ArrowTopRightIcon className="h-4 w-4" />
              <span className="sr-only">Open</span>
            </Button>
          </TooltipTrigger>
          <TooltipContent side="top">Open</TooltipContent>
        </Tooltip>
      </TooltipProvider>

      <ItemDistributeDialog pr_no={pr_no} isOpen={isDialogOpen} setIsOpen={setIsDialogOpen} />
    </>
  );
};
