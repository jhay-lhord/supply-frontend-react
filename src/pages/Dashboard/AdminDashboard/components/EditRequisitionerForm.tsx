import React, { useEffect } from "react";
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

import { Description } from "@radix-ui/react-dialog";

import Loading from "../../shared/components/Loading";
import { Loader2 } from "lucide-react";
import {
  useGetRequisitioner,
  useUpdateRequisitioner,
} from "@/services/requisitionerServices";
import {
  requisitionerSchema,
  RequisitionerType,
} from "@/types/request/requisitioner";
import { Label } from "@/components/ui/label";

interface EditRequisitionerFormProps {
  isEditDialogOpen: boolean;
  setIsEditDialogOpen: (open: boolean) => void;
  requisition_id: string;
}

const EditRequisitionerForm: React.FC<EditRequisitionerFormProps> = ({
  isEditDialogOpen,
  setIsEditDialogOpen,
  requisition_id,
}) => {
  const { isLoading, data: requisitioner } = useGetRequisitioner(
    requisition_id!
  );
  const { mutate, isPending } = useUpdateRequisitioner();
  const {
    register,
    handleSubmit,
    formState: { errors },

    setValue,
  } = useForm<RequisitionerType>({
    resolver: zodResolver(requisitionerSchema),
    defaultValues: {
      requisition_id: requisitioner?.data?.requisition_id,
      name: requisitioner?.data?.name,
      gender: requisitioner?.data?.gender,
      department: requisitioner?.data?.department,
      designation: requisitioner?.data?.designation,
    },
  });

  useEffect(() => {
    if (requisitioner?.data) {
      setValue("requisition_id", requisitioner?.data?.requisition_id);
      setValue("name", requisitioner?.data?.name);
      setValue("gender", requisitioner?.data?.gender);
      setValue("department", requisitioner?.data?.department);
      setValue("designation", requisitioner?.data?.designation);
    }
  }, [requisitioner, setValue]);

  const onSubmit = async (data: RequisitionerType) => {
    try {
      const result = requisitionerSchema.safeParse(data);

      if (result.success) {
        mutate(data);
        setIsEditDialogOpen(false);
      }
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
      <DialogContent className="max-w-full w-[40rem]">
        <ScrollArea className="h-[30rem] mb-8">
          <DialogHeader>
            <DialogTitle className="py-6">Edit Requisitioner</DialogTitle>
          </DialogHeader>
          <Description>
            {isLoading ? (
              <Loading />
            ) : (
              <form
                onSubmit={handleSubmit((requisitioner) =>
                  onSubmit(requisitioner)
                )}
              >
                <div className="flex flex-col gap-6">
                  <div>
                    <Label >Name</Label>
                    <Input {...register("name")} />
                    {errors?.name && (
                      <span className="text-xs text-red-500">
                        {errors?.name?.message}
                      </span>
                    )}
                  </div>

                  <div>
                  <Label >Gender</Label>
                    <Input {...register("gender")} />
                    {errors?.gender && (
                      <span className="text-xs text-red-500">
                        {errors?.gender?.message}
                      </span>
                    )}
                  </div>

                  <div>
                  <Label >Department</Label>
                    <Input {...register("department")} />
                    {errors?.department && (
                      <span className="text-xs text-red-500">
                        {errors?.department?.message}
                      </span>
                    )}
                  </div>

                  <div>
                  <Label >Designation</Label>
                    <Input {...register("designation")} />
                    {errors?.designation && (
                      <span className="text-xs text-red-500">
                        {errors?.designation?.message}
                      </span>
                    )}
                  </div>

                  <div className="mt-6 fixed bottom-6 right-6">
                    <Button
                      className="text-slate-950 bg-orange-200 hover:bg-orange-300 px-10"
                      type="submit"
                    >
                      {isPending ? (
                        <Loader2 className="animate-spin" />
                      ) : (
                        "Save Changes"
                      )}
                    </Button>
                  </div>
                </div>
              </form>
            )}
          </Description>
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
};

export default EditRequisitionerForm;
