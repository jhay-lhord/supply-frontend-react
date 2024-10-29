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
import { generatePrNo } from "@/services/generatePrNo";
import { toast } from "sonner";

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
    reset
  } = useForm<PurchaseRequestData>({
    resolver: zodResolver(purchaseRequestFormSchema),
  });

  const queryClient = useQueryClient();

  const addPurchaseRequestMutation = useMutation({
    mutationFn: AddPurchaseRequest,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["purchase-request"] });
      toast.success("Added Successfully", {
        description: "Purchase Request Added Successfully"
      })
      reset()
    },
  });

  const currentPurchaseNumber = lastPrNo && lastPrNo;

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
      <DialogContent className="max-w-full w-[30rem]">
        <ScrollArea className="h-[25rem] mb-8">
          <DialogHeader>
            <DialogTitle className="py-6">Create Purchase Request</DialogTitle>
          </DialogHeader>
          <Description>
            <form onSubmit={handleSubmit(onSubmit)}>

              <div className="grid gap-4">
                <div>
                  <Input
                    placeholder="PR No"
                    {...register("pr_no")}
                    value={generatePrNo(currentPurchaseNumber)}
                  />
                  {errors.pr_no && (
                    <span className="text-red-400 text-xs">
                      {errors.pr_no.message}
                    </span>
                  )}
                </div>

                <div>
                  <Input
                    placeholder="Res Center Code"
                    {...register("res_center_code")}
                  />
                  {errors.res_center_code && (
                    <span className="text-red-400 text-xs">
                      {errors.res_center_code.message}
                    </span>
                  )}
                </div>

                <div>
                  {" "}
                  <Input placeholder="Purpose" {...register("purpose")} />
                  {errors.purpose && (
                    <span className="text-red-400 text-xs">
                      {errors.purpose.message}
                    </span>
                  )}
                </div>

                <div>
                  <Input
                    placeholder="Requested By"
                    {...register("requested_by")}
                  />
                  {errors.requested_by && (
                    <span className="text-red-400 text-xs">
                      {errors.requested_by.message}
                    </span>
                  )}
                </div>

                <div>
                  <Input
                    placeholder="Approved By"
                    {...register("approved_by")}
                  />
                  {errors.approved_by && (
                    <span className="text-red-400 text-xs">
                      {errors.approved_by.message}
                    </span>
                  )}
                </div>
                <div className="mt-6 fixed bottom-6 right-10">
                  <Button
                    className="text-slate-950 bg-orange-200 hover:bg-orange-300"
                    type="submit"
                  >
                    Submit Purchase Request
                  </Button>
                </div>
              </div>
            </form>
          </Description>
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
};

export default PurchaseRequestForm;
