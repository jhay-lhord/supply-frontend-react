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
  useGetBACmember,
  useUpdateBACmember,
} from "@/services/BACmemberServices";

import { EditBACmemberSchema, EditBACmemberType } from "@/types/request/BACmember";

import { Label } from "@/components/ui/label";

interface EditBACmemberFormProps {
  isEditDialogOpen: boolean;
  setIsEditDialogOpen: (open: boolean) => void;
  member_id: string;
}

const EditBACmemberForm: React.FC<EditBACmemberFormProps> = ({
  isEditDialogOpen,
  setIsEditDialogOpen,
  member_id,
}) => {
  const { isLoading, data: BACmember } = useGetBACmember(member_id!);
  const { mutate, isPending } = useUpdateBACmember();
  const {
    register,
    handleSubmit,
    formState: { errors },

    setValue,
  } = useForm<EditBACmemberType>({
    resolver: zodResolver(EditBACmemberSchema),
    defaultValues: {
      member_id: BACmember?.data?.member_id,
      name: BACmember?.data?.name,
      designation: BACmember?.data?.designation,
    },
  });

  useEffect(() => {
    if (BACmember?.data) {
      setValue("member_id", BACmember?.data?.member_id);
      setValue("name", BACmember?.data?.name);
      setValue("designation", BACmember?.data?.designation);
    }
  }, [BACmember, setValue]);

  const onSubmit = async (data: EditBACmemberType) => {
    try {
      const result = EditBACmemberSchema.safeParse({...data, 
        name:`${data.last_name}, ${data.first_name} ${data.middle_name}`
      });

      if (result.success) {
        mutate(data);
        setIsEditDialogOpen(false);
      }
    } catch (error) {
      console.log(error);
    }
  };

  const renderField = (
    label: string,
    name: keyof EditBACmemberType,
    component: React.ReactNode
  ) => (
    <div className="mb-4 text-gray-950">
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
        <ScrollArea className="h-[30rem] mb-8">
          <DialogHeader>
            <DialogTitle className="py-6">Edit BAC member</DialogTitle>
          </DialogHeader>
          <Description>
            {isLoading ? (
              <Loading />
            ) : (
              <form onSubmit={handleSubmit((BACmember) => onSubmit(BACmember))}>
                <div className="flex flex-col gap-6">
                  {renderField(
                    "Last Name, First Name MI.",
                    "name",
                    <Input {...register("name")} />
                  )}

                  {renderField(
                    "Designation",
                    "designation",
                    <Input {...register("designation")} />
                  )}

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

export default EditBACmemberForm;
