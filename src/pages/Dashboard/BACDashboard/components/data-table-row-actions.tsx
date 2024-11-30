import { ArrowTopRightIcon, PlusIcon } from "@radix-ui/react-icons";
import { Button } from "@/components/ui/button";
import {
  Tooltip,
  TooltipProvider,
  TooltipTrigger,
  TooltipContent,
} from "@/components/ui/tooltip";
import { purchaseRequestType } from "@/types/response/puchase-request";
import { useNavigate } from "react-router-dom";
import { TwoStepRFQForm } from "./TwoStepRFQForm";
import { useState } from "react";

interface DataTableRowActionsProps {
  pr_no: string;
  _data: purchaseRequestType;
  link: string;
}

export const DataTableRowActions = ({
  pr_no,
  link
}: DataTableRowActionsProps) => {

  const [isDialogOpen, setIsDialogOpen] = useState<boolean>(false);
  const navigate = useNavigate();

  const handleViewClick = (event: React.MouseEvent) => {
    event.stopPropagation();
    navigate(`/bac/${link}/${pr_no}`);
  };


  return (
    <>
      <TooltipProvider delayDuration={100} skipDelayDuration={200}>
        <div className="flex gap-4 ">
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                onClick={handleViewClick}
                variant="default"
                className="flex data-[state=open]:bg-muted hover:rounded-full"
              >
                <p className="px-2">Open</p><ArrowTopRightIcon className="h-4 w-4 text-gray-900" />
                <span className="sr-only">Open</span>
              </Button>
            </TooltipTrigger>
            <TooltipContent side="top">Open</TooltipContent>
          </Tooltip>

          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                onClick={() => setIsDialogOpen(true)}
                variant="outline"
                className="flex data-[state=open]:bg-muted hover:rounded-full"
              >
                <p className="px-2">Add</p><PlusIcon className="h-4 w-4 text-gray-900" />
                <span className="sr-only">Create RFQ</span>
              </Button>
            </TooltipTrigger>
            <TooltipContent side="top">Create RFQ</TooltipContent>
          </Tooltip>
        </div>
      </TooltipProvider>

      <TwoStepRFQForm isDialogOpen={isDialogOpen} setIsDialogOpen={setIsDialogOpen}pr_no={pr_no} />
    </>
  );
};
