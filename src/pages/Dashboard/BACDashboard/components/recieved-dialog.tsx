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

interface ReceivedDialogProps {
  prNo: string;
  isReceivedDialogOpen: boolean;
  setIsReceivedDialogOpen: (open: boolean) => void;
}

export default function ReceivedDialog({
  prNo,
  isReceivedDialogOpen,
  setIsReceivedDialogOpen,
}: ReceivedDialogProps) {
  const { mutate, isPending } = useUpdatePurchaseRequestStatus();

  const handleReceive = () => {
    mutate(
      { pr_no: prNo, status: "Received by the Procurement" },
      {
        onSuccess: () => {
          setIsReceivedDialogOpen(false);
        },
      }
    );
  };

  return (
    <Dialog open={isReceivedDialogOpen} onOpenChange={setIsReceivedDialogOpen}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Receive Purchase Request</DialogTitle>
          <DialogDescription>
            Are you sure you want to Received this Purchase Request? This action cannot be
            undone.
          </DialogDescription>
        </DialogHeader>
        <div className="flex flex-col-reverse sm:flex-row sm:justify-end sm:space-x-2">
          <Button variant={"outline"}
            onClick={() => setIsReceivedDialogOpen(false)}
          >
            No, go back
          </Button>
          <Button className="px-8"  onClick={handleReceive}>
            {isPending ? (
              <Loader2 className="animate-spin" />
            ) : (
              "Yes"
            )}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
