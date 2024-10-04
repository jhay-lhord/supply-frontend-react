import React from "react";
import api from "@/api";
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

  const currentPurchaseNumber = lastPrNo && lastPrNo;

  const purchaseRequestNumberFormat = (
    currentYear: number,
    currentMonthFormatted: string | number,
    nextPurchaseNumber: number
  ) => {
    return nextPurchaseNumber < 1000
      ? `${currentYear}-${currentMonthFormatted}-${nextPurchaseNumber
          .toString()
          .padStart(4, "0")}`
      : `${currentYear}-${currentMonthFormatted}-${nextPurchaseNumber.toString()}`;
  };

  const generateNextPrNo = (currentPurchaseNumber: string | undefined) => {
    const currentDate = new Date();
    const currentMonth = currentDate.getMonth() + 1;
    const currentMonthFormatted =
      currentMonth < 10 ? `0${currentMonth}` : currentMonth;
    const currentYear = currentDate.getFullYear();

    const last4DigitPRNumber = currentPurchaseNumber?.split("-").pop() ?? '0000';

    const nextPurchaseNumber = parseInt(last4DigitPRNumber) + 1;

    if (!currentPurchaseNumber) {
      console.log("kaniposd");
      return purchaseRequestNumberFormat(
        currentYear,
        currentMonthFormatted,
        nextPurchaseNumber
      );
    } else {
      console.log("nigana");
      return purchaseRequestNumberFormat(
        currentYear,
        currentMonthFormatted,
        nextPurchaseNumber
      );
    }
  };

  generateNextPrNo(currentPurchaseNumber);
  console.log(generateNextPrNo(currentPurchaseNumber))

  const onSubmit = async (data: PurchaseRequestData) => {
    try {
      const result = purchaseRequestFormSchema.safeParse(data);
      console.log(result);

      if (result.success) {
        console.log("no errors");
        setIsDialogOpen(false);

        const purchaseRequestResponse = await api.post(
          "/api/purchase-request/",
          {
            pr_no: data.pr_no,
            res_center_code: data.res_center_code,
            purpose: data.purpose,
            status: data.status,
            requested_by: data.requested_by,
            approved_by: data.approved_by,
          }
        );

        console.log(purchaseRequestResponse)

        console.log("Purchase request saved successfully.");
      }
    } catch (error) {
      console.error("Error saving purchase request and items:", error);
    }
  };

  return (
    <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
      <DialogContent className="max-w-full w-[60rem]">
        <ScrollArea className="h-[20rem] mb-8">
          <DialogHeader>
            <DialogTitle className="py-6">Create Purchase Request</DialogTitle>
          </DialogHeader>
          <Description>
            <form onSubmit={handleSubmit(onSubmit)}>
              {/* Purchase Request Fields */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Input
                    placeholder="PR No"
                    {...register("pr_no")}
                    value={generateNextPrNo(currentPurchaseNumber)}
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
                  <Input placeholder="Status" {...register("status")} />
                  {errors.status && (
                    <span className="text-red-400 text-xs">
                      {errors.status.message}
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
