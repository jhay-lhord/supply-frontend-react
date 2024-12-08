import React, { useEffect, useState } from "react";
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
import { Label } from "@/components/ui/label";
import { Description } from "@radix-ui/react-dialog";
import Loading from "../../shared/components/Loading";
import { Loader2 } from "lucide-react";
import { usePurchaseRequestList, useUpdatePurchaseRequest } from "@/services/purchaseRequestServices";
import { EditPRFormSchema, EditPRFormType } from "@/types/request/purchase-request";

interface EditPRFormProps {
  isEditDialogOpen: boolean;
  setIsEditDialogOpen: (open: boolean) => void;
  pr_no: string;
}

const EditPRForm: React.FC<EditPRFormProps> = ({
  isEditDialogOpen,
  setIsEditDialogOpen,
  pr_no,
}) => {
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const {
    isLoading: purchaseRequestLoading,
    data: purchase_request,
  } = usePurchaseRequestList(pr_no!);

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
      res_center_code: purchaseData?.res_center_code,
      requested_by: purchaseData?.requested_by,
    },
  });

  const { mutate } = useUpdatePurchaseRequest();

  useEffect(() => {
    if (purchaseData) {
      setValue("purpose", purchaseData.purpose || "");
      setValue("res_center_code", purchaseData.res_center_code || "");
      setValue("requested_by", purchaseData.requested_by || "");
    }
  }, [purchaseData, setValue]);



  const onSubmit = (data: EditPRFormType) => {
    setIsLoading(true)
    const result = EditPRFormSchema.safeParse(data);

    if (result.success) {
      mutate({pr_no: pr_no, data: data}, {
        onSuccess: () => {
          setIsLoading(false)
          setIsEditDialogOpen(false)
        }
      });
    }

  };

  return (
    <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
      <DialogContent className="max-w-full w-[40rem]">
        <ScrollArea className="h-[20rem] mb-8">
          <DialogHeader>
            <DialogTitle className="py-6">Edit Purchase Request</DialogTitle>
          </DialogHeader>
          <Description>
            {purchaseRequestLoading ? (
              <Loading />
            ) : (
              <form
            onSubmit={handleSubmit((data) => onSubmit(data))}
            className="border-none rounded"
          >
            <div className="">
              <InputField
                label="Res Center Code"
                name="res_center_code"
                register={register}
                error={errors.res_center_code}
              />
              <InputField
                label="Purpose"
                name="purpose"
                register={register}
                error={errors.purpose}
              />
              <InputField
                label="Requested By"
                name="requested_by"
                register={register}
                error={errors.requested_by}
              />
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
          </Description>
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
};

const ErrorMessage = ({ message }: { message?: string }) =>
  message ? <p className="text-red-500 text-sm mt-1">{message}</p> : null;


const InputField = ({
  label,
  name,
  register,
  error,
}: {
  label: string;
  name: string;
  register: any;
  error?: { message?: string };
}) => (
  <div>
    <Label className="text-base">{label}</Label>
    <Input
      className="mt-2"
      {...register(name)}
      placeholder={label}
    />
    <ErrorMessage message={error?.message} />
  </div>
);


export default EditPRForm;
