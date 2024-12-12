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
import ReceivedDialog from "./recieved-dialog";
import { useState } from "react";
import { FolderDownIcon } from "lucide-react";

interface DataTableRowActionsProps {
  pr_no: string;
}

export const IncomingDataTableRowActions = ({
  pr_no,
}: DataTableRowActionsProps) => {
  const [isReceivedDialogOpen, setIsReceivedDialogOpen] =
    useState<boolean>(false);

  const handleReceiveClick = () => {
    setIsReceivedDialogOpen(true);
  };

  return (
    <>
      <TooltipProvider delayDuration={100} skipDelayDuration={200}>
        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              onClick={handleReceiveClick}
              variant="default"
              className="flex data-[state=open]:bg-muted hover:rounded-full"
            >
              <p className="px-2">Receive</p>
              <FolderDownIcon className="h-4 w-4 text-gray-900" />
              <span className="sr-only">Receive</span>
            </Button>
          </TooltipTrigger>
          <TooltipContent side="top">Receive</TooltipContent>
        </Tooltip>
      </TooltipProvider>
      <ReceivedDialog
        prNo={pr_no}
        isReceivedDialogOpen={isReceivedDialogOpen}
        setIsReceivedDialogOpen={setIsReceivedDialogOpen}
      />
    </>
  );
};
