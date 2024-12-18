import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useUpdatePurchaseOrderStatus } from "@/services/puchaseOrderServices";
import { Loader2 } from "lucide-react";

interface CancelOrderDialogProps {
  poNo: string;
  isCancelDialogOpen: boolean;
  setIsCancelDialogOpen: (open: boolean) => void;
}

export default function CancelOrderDialog({
  poNo,
  isCancelDialogOpen,
  setIsCancelDialogOpen,
}: CancelOrderDialogProps) {
  const { mutate, isPending } = useUpdatePurchaseOrderStatus();

  const handleCancelOrder = () => {
    mutate(
      { po_no: poNo, status: "Cancelled" },
      {
        onSuccess: () => {
          setIsCancelDialogOpen(false);
        },
      }
    );
  };

  return (
    <Dialog open={isCancelDialogOpen} onOpenChange={setIsCancelDialogOpen}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Cancel Order</DialogTitle>
          <DialogDescription>
            Are you sure you want to cancel this order? This action cannot be
            undone.
          </DialogDescription>
        </DialogHeader>
        <div className="flex flex-col-reverse sm:flex-row sm:justify-end sm:space-x-2">
          <Button
            variant="outline"
            onClick={() => setIsCancelDialogOpen(false)}
          >
            No, go back
          </Button>
          <Button variant="destructive" onClick={handleCancelOrder}>
            {isPending ? (
              <Loader2 className="animate-spin" />
            ) : (
              "Yes, cancel order"
            )}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
