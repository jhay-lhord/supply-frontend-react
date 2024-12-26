import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useUpdatePurchaseRequestStatus } from "@/services/purchaseRequestServices";
import { Loader2 } from "lucide-react";
import { MessageDialog } from "../../shared/components/MessageDialog";
import { useState } from "react";

interface ReceivedDialogProps {
  prNo: string;
  isReceivedDialogOpen: boolean;
  setIsReceivedDialogOpen: (open: boolean) => void;
}

interface messageDialogProps {
  open: boolean;
  message: string;
  type: "success" | "error" | "info";
  title: string;
}

export default function ReceivedDialog({
  prNo,
  isReceivedDialogOpen,
  setIsReceivedDialogOpen,
}: ReceivedDialogProps) {
  const [messageDialog, setMessageDialog] = useState<messageDialogProps>({
    open: false,
    type: "success" as const,
    title: "",
    message: "",
  });
  const { mutate, isPending } = useUpdatePurchaseRequestStatus();

  const handleReceive = () => {
    mutate(
      { pr_no: prNo, status: "Received by the Procurement" },
      {
        onSuccess: (response) => {
          if (response.status === "success") {
            setIsReceivedDialogOpen(false);
            setMessageDialog({
              open: true,
              message: "Received Purchase Successfully",
              title: "Success",
              type: "success",
            });
          } else {
            setIsReceivedDialogOpen(false);
            setMessageDialog({
              open: true,
              message: "Something went wrong, Please try again later",
              title: "Error",
              type: "error",
            });
          }
        },
        onError: () => {
          setIsReceivedDialogOpen(false);
          setMessageDialog({
            open: true,
            message: "Something went wrong, Please try again later",
            title: "Error",
            type: "error",
          });
        },
      }
    );
  };

  return (
    <>
      <Dialog
        open={isReceivedDialogOpen}
        onOpenChange={setIsReceivedDialogOpen}
      >
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Receive Purchase Request</DialogTitle>
            <DialogDescription>
              Are you sure you want to Received this Purchase Request? This
              action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <div className="flex flex-col-reverse sm:flex-row sm:justify-end sm:space-x-2">
            <Button
              variant={"outline"}
              onClick={() => setIsReceivedDialogOpen(false)}
            >
              No, go back
            </Button>
            <Button className="px-8" onClick={handleReceive}>
              {isPending ? <Loader2 className="animate-spin" /> : "Yes"}
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      <MessageDialog
        message={messageDialog?.message}
        title={messageDialog?.title}
        type={messageDialog?.type}
        open={messageDialog?.open}
        onOpenChange={(open) => setMessageDialog((prev) => ({ ...prev, open }))}
      />
    </>
  );
}
