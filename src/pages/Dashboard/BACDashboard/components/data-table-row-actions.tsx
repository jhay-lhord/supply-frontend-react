import { ArrowTopRightIcon } from "@radix-ui/react-icons";
import { Button } from "@/components/ui/button";
import {
  Tooltip,
  TooltipProvider,
  TooltipTrigger,
  TooltipContent,
} from "@/components/ui/tooltip";
import { purchaseRequestType } from "@/types/response/puchase-request";
import { useNavigate } from "react-router-dom";

interface DataTableRowActionsProps {
  pr_no: string;
  _data: purchaseRequestType;
  link: string;
}

export const DataTableRowActions = ({
  pr_no,
  link
}: DataTableRowActionsProps) => {

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
                <ArrowTopRightIcon className="h-4 w-4 text-orange-400" />
                <span className="sr-only">Open</span>
              </Button>
            </TooltipTrigger>
            <TooltipContent side="top">Open</TooltipContent>
          </Tooltip>
        </div>
      </TooltipProvider>
    </>
  );
};
