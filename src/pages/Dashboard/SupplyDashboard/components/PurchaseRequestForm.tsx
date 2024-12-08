import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";

import {
  purchaseRequestFormSchema,
  type PurchaseRequestData,
} from "@/types/request/purchase-request";
import { AddPurchaseRequest } from "@/services/purchaseRequestServices";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { generatePrNo } from "@/services/generatePrNo";
import { toast } from "sonner";
import { campusDirector } from "../data/campus-director";
import AsyncSelect from "react-select/async";
import { getAllRequisitioner } from "@/services/requisitionerServices";
import { Loader2 } from "lucide-react";

interface PurchaseRequestFormProps {
  isDialogOpen: boolean;
  setIsDialogOpen: (open: boolean) => void;
  lastPrNo: string | undefined;
}

type requisitionerOption = {
  value: string;
  label: string;
};

const PurchaseRequestForm: React.FC<PurchaseRequestFormProps> = ({
  isDialogOpen,
  setIsDialogOpen,
  lastPrNo,
}) => {
  const [requisitioner, setRequisitioner] =
    useState<requisitionerOption | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const currentPurchaseNumber = lastPrNo && lastPrNo;
  const queryClient = useQueryClient();

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
    reset,
  } = useForm<PurchaseRequestData>({
    resolver: zodResolver(purchaseRequestFormSchema),
  });

  const loadOptions = async (
    inputValue: string
  ): Promise<requisitionerOption[]> => {
    try {
      const requisitioners = await getAllRequisitioner();
      return (
        requisitioners.data
          ?.filter((requisitioner) =>
            requisitioner.name.toLowerCase().includes(inputValue.toLowerCase())
          )
          .map((requisitioner) => ({
            value: requisitioner.name,
            label: requisitioner.name,
          })) || []
      );
    } catch (error) {
      console.log(error);
      return [];
    }
  };

  const addPurchaseRequestMutation = useMutation({
    mutationFn: AddPurchaseRequest,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["purchase-request"] });
      toast.success("Added Successfully", {
        description: "Purchase Request Added Successfully",
      });
      reset();
    },
  });

  const handleChange = (selectedOption: requisitionerOption | null) => {
    setRequisitioner(selectedOption);
    setValue("requested_by", selectedOption?.label ?? "");
  };

  const onSubmit = async (data: PurchaseRequestData) => {
    setIsLoading(true);
    if (purchaseRequestFormSchema.safeParse(data).success) {
      setIsDialogOpen(false);
      addPurchaseRequestMutation.mutate({
        ...data,
        approved_by: campusDirector.name,
        requested_by: requisitioner?.label ?? "",
      });
    }
    if (addPurchaseRequestMutation.isSuccess) {
      setIsLoading(false);
      setIsDialogOpen(false);
    }
  };

  const renderField = (
    label: string,
    name: keyof PurchaseRequestData,
    component: React.ReactNode
  ) => (
    <div>
      <Label>{label}</Label>
      {component}
      {errors[name] && (
        <span className="text-red-400 text-xs">{errors[name]?.message}</span>
      )}
    </div>
  );

  return (
    <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
      <DialogContent className="max-w-full w-[45rem]">
        <ScrollArea className="h-[32rem] mb-8">
          <DialogTitle className="pb-6">Create Purchase Request</DialogTitle>
          <form onSubmit={handleSubmit(onSubmit)}>
            <div className="grid gap-4">
              {renderField(
                "PR No.",
                "pr_no",
                <Input
                  {...register("pr_no")}
                  value={generatePrNo(currentPurchaseNumber)}
                  readOnly
                />
              )}
              {renderField(
                "Res Center Code",
                "res_center_code",
                <Input {...register("res_center_code")} />
              )}
              {renderField(
                "Purpose",
                "purpose",
                <Textarea {...register("purpose")} />
              )}
              {renderField(
                "Requested By",
                "requested_by",
                <AsyncSelect
                  defaultOptions
                  loadOptions={loadOptions}
                  onChange={handleChange}
                  placeholder="Search for a Requisitioner..."
                  className="mb-4 text-sm"
                />
              )}
              {renderField(
                "Approved By",
                "approved_by",
                <Input
                  {...register("approved_by")}
                  defaultValue={campusDirector.name}
                  readOnly
                />
              )}
              <div className="mt-6 fixed bottom-6 right-10">
                <Button
                  className="text-slate-950 bg-orange-200 hover:bg-orange-300"
                  type="submit"
                >
                  {isLoading ? (
                    <Loader2 className="animate-spin" />
                  ) : (
                    "Submit Purchase Request"
                  )}
                </Button>
              </div>
            </div>
          </form>
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
};

export default PurchaseRequestForm;
