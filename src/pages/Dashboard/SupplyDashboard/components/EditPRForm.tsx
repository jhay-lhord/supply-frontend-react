import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import Loading from "../../shared/components/Loading";
import { Loader2 } from "lucide-react";
import {
  usePurchaseRequestList,
  useUpdatePurchaseRequest,
} from "@/services/purchaseRequestServices";
import {
  EditPRFormSchema,
  EditPRFormType,
} from "@/types/request/purchase-request";
import { getAllRequisitioner } from "@/services/requisitionerServices";
import AsyncSelect from "react-select/async";
import { Textarea } from "@/components/ui/textarea";

interface EditPRFormProps {
  isEditDialogOpen: boolean;
  setIsEditDialogOpen: (open: boolean) => void;
  pr_no: string;
}

type option = {
  value: string;
  label: string;
};

const EditPRForm: React.FC<EditPRFormProps> = ({
  isEditDialogOpen,
  setIsEditDialogOpen,
  pr_no,
}) => {
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const { isLoading: purchaseRequestLoading, data: purchase_request } =
    usePurchaseRequestList(pr_no!);

  const purchaseData = purchase_request?.data;

  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
  } = useForm<EditPRFormType>({
    resolver: zodResolver(EditPRFormSchema),
    defaultValues: {
      purpose: purchaseData?.purpose,
      office: purchaseData?.office,
      requisitioner: purchaseData?.requisitioner_details.name,
    },
  });

  const { mutate } = useUpdatePurchaseRequest();

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

  const handleRequisitionerChange = (selectedOption: option | null) => {
    setValue("requisitioner", selectedOption?.value ?? "");
  };

  const onSubmit = (data: EditPRFormType) => {
    setIsLoading(true);
    const result = EditPRFormSchema.safeParse(data);

    if (result.success) {
      mutate(
        { pr_no: pr_no, data: data },
        {
          onSuccess: () => {
            setIsLoading(false);
            setIsEditDialogOpen(false);
          },
        }
      );
    }
  };

  const renderField = (
    label: string,
    name: keyof EditPRFormType,
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
    <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
      <DialogContent className="max-w-full w-[40rem]">
        <ScrollArea className="h-[20rem] mb-8">
          <DialogHeader>
            <DialogTitle className="py-6">Edit Purchase Request</DialogTitle>
          </DialogHeader>
          <DialogDescription>
            {purchaseRequestLoading ? (
              <Loading />
            ) : (
              <form
                onSubmit={handleSubmit((data) => onSubmit(data))}
                className="border-none rounded"
              >
                <div className="">
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
                      defaultValue={{value: purchaseData?.requisitioner_details.requisition_id ?? "", label:purchaseData?.requisitioner_details.name ?? ""}}
                      defaultOptions
                      loadOptions={loadRequisitionerOptions}
                      onChange={handleRequisitionerChange}
                      placeholder="Search for a Requisitioner..."
                      className="mb-4 text-sm"
                    />
                  )}
                </div>
                <div className="mt-6 fixed bottom-6 right-6">
                  <Button
                    className="text-slate-950 bg-orange-200 hover:bg-orange-300 px-10"
                    type="submit"
                  >
                    {isLoading ? (
                      <Loader2 className="animate-spin" />
                    ) : (
                      "Save Changes"
                    )}
                  </Button>
                </div>
              </form>
            )}
          </DialogDescription>
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
};

export default EditPRForm;
