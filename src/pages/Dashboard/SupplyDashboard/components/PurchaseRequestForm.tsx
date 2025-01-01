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
import {
  useAddPurchaseRequest,
} from "@/services/purchaseRequestServices";
import { generatePrNo } from "@/services/generatePrNo";
import AsyncSelect from "react-select/async";
import { getAllRequisitioner } from "@/services/requisitionerServices";
import { Loader2 } from "lucide-react";
import { getAllCampusDirector } from "@/services/campusDirectorServices";
import { MessageDialog } from "../../shared/components/MessageDialog";

interface PurchaseRequestFormProps {
  isDialogOpen: boolean;
  setIsDialogOpen: (open: boolean) => void;
  lastPrNo: string | undefined;
}

type option = {
  value: string;
  label: string;
};

interface messageDialogProps {
  open: boolean;
  message: string;
  title: string;
  type: "success" | "error" | "info";
}

const PurchaseRequestForm: React.FC<PurchaseRequestFormProps> = ({
  isDialogOpen,
  setIsDialogOpen,
  lastPrNo,
}) => {
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [messageDialog, setMessageDialog] = useState<messageDialogProps>({
    open: false,
    message: "",
    title: "",
    type: "success" as const,
  });

  const { mutate: addPurchaseRequestMutation } = useAddPurchaseRequest();
  const currentPurchaseNumber = lastPrNo && lastPrNo;

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
    reset,
  } = useForm<PurchaseRequestData>({
    resolver: zodResolver(purchaseRequestFormSchema),
  });

  const loadRequisitionerOptions = async (
    inputValue: string
  ): Promise<option[]> => {
    try {
      const requisitioners = await getAllRequisitioner();
      return (
        requisitioners.data
          ?.filter((requisitioner) =>
            requisitioner.name.toLowerCase().includes(inputValue.toLowerCase())
          )
          .map((requisitioner) => ({
            value: requisitioner.requisition_id,
            label: requisitioner.name,
          })) || []
      );
    } catch (error) {
      console.log(error);
      return [];
    }
  };

  const loadCampusDirectorOptions = async (
    inputValue: string
  ): Promise<option[]> => {
    try {
      const campus_directors = await getAllCampusDirector();
      return (
        campus_directors.data
          ?.filter((campus_director) =>
            campus_director.name
              .toLowerCase()
              .includes(inputValue.toLowerCase())
          )
          .map((campus_director) => ({
            value: campus_director.cd_id,
            label: campus_director.name,
          })) || []
      );
    } catch (error) {
      console.log(error);
      return [];
    }
  };

  const handleRequisitionerChange = (selectedOption: option | null) => {
    setValue("requisitioner", selectedOption?.value ?? "");
  };

  const handleCampusDirectorChange = (selectedOption: option | null) => {
    setValue("campus_director", selectedOption?.value ?? "");
  };

  const onSubmit = async (data: PurchaseRequestData) => {
    setIsLoading(true);

    const result = purchaseRequestFormSchema.safeParse(data);

    if (result.success) {
      addPurchaseRequestMutation(data, {
        onSuccess: (response) => {
          if (response.status === "success") {
            reset()
            setIsDialogOpen(false);
            setIsLoading(false);
            setMessageDialog({
              open: true,
              message: "Purchase Request added successfully",
              title: "Success",
              type: "success",
            });
          } else {
            reset()
            setIsDialogOpen(false);
            setIsLoading(false);
            setMessageDialog({
              open: true,
              message: "Something went wrong, please try again later",
              title: "Error",
              type: "error",
            });
          }
        },
        onError: () => {
          reset()
          setIsDialogOpen(false);
          setIsLoading(false);
          setMessageDialog({
            open: true,
            message: "Something went wrong, please try again later",
            title: "Error",
            type: "error",
          });
        },
      });
    }
  };

  const renderField = (
    label: string,
    name: keyof PurchaseRequestData,
    component: React.ReactNode
  ) => (
    <div className="w-full">
      <Label>{label}</Label>
      {component}
      {errors[name] && (
        <span className="text-red-400 text-xs">{errors[name]?.message}</span>
      )}
    </div>
  );

  return (
    <>
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="max-w-full w-[45rem]">
          <DialogTitle className="pb-6">Create Purchase Request</DialogTitle>
          <ScrollArea className="h-[30rem] mb-8">
            <form onSubmit={handleSubmit(onSubmit)}>
              <div className="grid gap-4">
                <div className="flex gap-4">
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
                    "Fund Cluster",
                    "fund_cluster",
                    <Input {...register("fund_cluster")} />
                  )}
                </div>

                {renderField(
                  "Office",
                  "office",
                  <Input {...register("office")} />
                )}

                {renderField(
                  "Purpose",
                  "purpose",
                  <Textarea {...register("purpose")} />
                )}
                {renderField(
                  "Requested By",
                  "requisitioner",
                  <AsyncSelect
                    defaultOptions
                    loadOptions={loadRequisitionerOptions}
                    onChange={handleRequisitionerChange}
                    placeholder="Search for a Requisitioner..."
                    className="text-sm"
                  />
                )}
                {renderField(
                  "Approved By",
                  "campus_director",
                  <AsyncSelect
                    defaultOptions
                    loadOptions={loadCampusDirectorOptions}
                    onChange={handleCampusDirectorChange}
                    placeholder="Search for a Campus Director..."
                    className="text-sm"
                  />
                )}
                <div className="mt-6 fixed bottom-6 right-10">
                  <Button
                    className="text-slate-950 bg-orange-200 hover:bg-orange-300"
                    type="submit"
                  >
                    {isLoading ? (
                      <p className="flex gap-2"><Loader2 className="animate-spin" /> Processing...</p>
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
      <MessageDialog
        open={messageDialog.open}
        message={messageDialog.message}
        title={messageDialog.title}
        type={messageDialog.type}
        onOpenChange={(open) => setMessageDialog((prev) => ({ ...prev, open }))}
      />
    </>
  );
};

export default PurchaseRequestForm;
