import React from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Button } from "@/components/ui/button";
import {
  purchaseRequestFormSchema,
  type PurchaseRequestData,
} from "@/types/request/purchase-request";
import { Description } from "@radix-ui/react-dialog";
import { AddPurchaseRequest } from "@/services/purchaseRequestServices";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { generateNextPrNo } from "@/services/generateNextPrNo";

interface PurchaseRequestFormProps {
  isDialogOpen: boolean;
  setIsDialogOpen: (open: boolean) => void;
  lastPrNo: string | undefined;
}

const PurchaseRequestForm: React.FC<PurchaseRequestFormProps> = ({
  isDialogOpen,
  setIsDialogOpen,
  lastPrNo,
}) => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<PurchaseRequestData>({
    resolver: zodResolver(purchaseRequestFormSchema),
  });

  const queryClient = useQueryClient();

  const addPurchaseRequestMutation = useMutation({
    mutationFn: AddPurchaseRequest,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["purchase-request"] });
      console.log("refetch and invalidated");
    },
  });

  const currentPurchaseNumber = lastPrNo && lastPrNo;

  console.log(generateNextPrNo(currentPurchaseNumber));

  const onSubmit = async (data: PurchaseRequestData) => {
    try {
      console.log("submitting");
      const result = purchaseRequestFormSchema.safeParse(data);
      console.log(result);

      if (result.success) {
        console.log("no errors");
        setIsDialogOpen(false);

        const defaultPrStatus = "pending";

        addPurchaseRequestMutation.mutate({
          pr_no: data.pr_no,
          res_center_code: data.res_center_code,
          purpose: data.purpose,
          pr_status: defaultPrStatus,
          requested_by: data.requested_by,
          approved_by: data.approved_by,
        });

        console.log("Purchase request saved successfully.");
      }
    } catch (error) {
      console.error("Error saving purchase request and items:", error);
    }
  };

  return (
    <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
      <DialogContent className="max-w-full w-[40rem]">
        <ScrollArea className="h-[25rem] mb-8">
          <DialogHeader>
            <DialogTitle className="py-6">Create Purchase Request</DialogTitle>
          </DialogHeader>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            {/* PR No and Res Center Code */}
            <div className="grid grid-cols-2 gap-6">
              <div className="grid gap-2">
                <label htmlFor="pr_no" className="text-sm font-medium">PR No</label>
                <Input
                  id="pr_no"
                  placeholder="PR No"
                  {...register("pr_no")}
                  value={generateNextPrNo(currentPurchaseNumber)}
                  className="p-2 border border-gray-300 rounded"
                />
                {errors.pr_no && (
                  <span className="text-red-400 text-xs">{errors.pr_no.message}</span>
                )}
              </div>

              <div className="grid gap-2">
                <label htmlFor="res_center_code" className="text-sm font-medium">Res Center Code</label>
                <Input
                  id="res_center_code"
                  placeholder="Res Center Code"
                  {...register("res_center_code")}
                  className="p-2 border border-gray-300 rounded"
                />
                {errors.res_center_code && (
                  <span className="text-red-400 text-xs">{errors.res_center_code.message}</span>
                )}
              </div>
            </div>

            {/* Purpose (Full Width) */}
            <div className="grid gap-2">
              <label htmlFor="purpose" className="text-sm font-medium">Purpose</label>
              <Input
                id="purpose"
                placeholder=""
                {...register("purpose")}
                className="p-2 border border-gray-300 rounded w-full h-20"
              />
              {errors.purpose && (
                <span className="text-red-400 text-xs">{errors.purpose.message}</span>
              )}
            </div>

            {/* Requested By and Approved By */}
            <div className="grid grid-cols-2 gap-6">
              <div className="grid gap-2">
                <label htmlFor="requested_by" className="text-sm font-medium">Requested By</label>
                <Input
                  id="requested_by"
                  placeholder="Requested By"
                  {...register("requested_by")}
                  className="p-2 border border-gray-300 rounded"
                />
                {errors.requested_by && (
                  <span className="text-red-400 text-xs">{errors.requested_by.message}</span>
                )}
              </div>

              <div className="grid gap-2">
                <label htmlFor="approved_by" className="text-sm font-medium">Approved By</label>
                <Input
                  id="approved_by"
                  placeholder="Approved By"
                  {...register("approved_by")}
                  className="p-2 border border-gray-300 rounded"
                />
                {errors.approved_by && (
                  <span className="text-red-400 text-xs">{errors.approved_by.message}</span>
                )}
              </div>
            </div>

            {/* Submit Button (Centered) */}
            <div className="flex justify-center mt-6">
              <Button
                className="bg-orange-200 text-slate-950 hover:bg-orange-300 px-4 py-2 rounded-md"
                type="submit"
              >
                Submit Purchase Request
              </Button>
            </div>
          </form>
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
};

export default PurchaseRequestForm;
