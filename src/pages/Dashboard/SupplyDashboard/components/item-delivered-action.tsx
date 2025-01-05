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
import { useNavigate } from "react-router-dom";

interface ItemDistributionActionsProps {
  pr_no: string;
  _data: purchaseRequestType | abstractType_;
}

export const ItemDeliveredActions = ({
  _data,
  pr_no,
}: ItemDistributionActionsProps) => {
  const navigate = useNavigate()

  console.log(_data)
  return (
    <>
      <TooltipProvider delayDuration={100} skipDelayDuration={200}>
        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              onClick={() => navigate(`/supply/item-distribution/${pr_no}`)}
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

    </>
  );
};
