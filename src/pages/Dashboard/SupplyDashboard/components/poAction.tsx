import { Button } from "@/components/ui/button";
import {
  Tooltip,
  TooltipProvider,
  TooltipTrigger,
  TooltipContent,
} from "@/components/ui/tooltip";
interface DataTableRowActionsProps {
  po_no: string;
}

export const PORowActions = ({ po_no }: DataTableRowActionsProps) => {
  const handleCancel = () => {
    console.log(po_no);
  };

  return (
    <>
      <TooltipProvider>
        <div className="flex items-center gap-2">
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                variant={"outline"}
                onClick={handleCancel}
                className="flex data-[state=open]:bg-muted hover:bg-red-300 hover:border-none"
              >
                <p className="mx-1">Cancel</p>
                <span className="sr-only">Cancel</span>
              </Button>
            </TooltipTrigger>
            <TooltipContent side="top">Cancel Order</TooltipContent>
          </Tooltip>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                onClick={handleCancel}
                className="flex data-[state=open]:bg-muted"
              >
                <p className="mx-1">Order Recieved</p>
                <span className="sr-only">Order Received</span>
              </Button>
            </TooltipTrigger>
            <TooltipContent side="top">Order Received</TooltipContent>
          </Tooltip>
        </div>
      </TooltipProvider>
    </>
  );
};
