import React, { useEffect } from "react";
import { Controller, useForm } from "react-hook-form";
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
  EditRequisitionerSchema,
  EditRequisitionerType,
} from "@/types/request/requisitioner";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

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
    control,
    formState: { errors },

    setValue,
  } = useForm<EditRequisitionerType>({
    resolver: zodResolver(EditRequisitionerSchema),
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

  const onSubmit = async (data: EditRequisitionerType) => {
    try {
      const result = EditRequisitionerSchema.safeParse({
        ...data,
        name: `${data.last_name}, ${data.first_name} ${data.middle_name}`,
      });

      if (result.success) {
        console.log(data);
        mutate({
          requisition_id: requisition_id,
          first_name: data.first_name,
          last_name: data.last_name,
          middle_name: data.middle_name,
          name: data.name,
          gender: data.gender,
          department: data.department,
          designation: data.designation,
        });
        setIsEditDialogOpen(false);
      }
    } catch (error) {
      console.log(error);
    }
  };

  const renderField = (
    label: string,
    name: keyof EditRequisitionerType,
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
                  {renderField(
                    "Last Name, First Name, MI",
                    "name",
                    <Input {...register("name")} />
                  )}


                  {renderField(
                    "Gender",
                    "gender",
                    <Controller
                      name="gender"
                      control={control}
                      render={({ field }) => (
                        <Select
                          value={field.value}
                          onValueChange={(value) => field.onChange(value)}
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="Select gender" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectGroup>
                              <SelectLabel>Gender</SelectLabel>
                              <SelectItem value="Male">Male</SelectItem>
                              <SelectItem value="Female">Female</SelectItem>
                            </SelectGroup>
                          </SelectContent>
                        </Select>
                      )}
                    />
                  )}

                  {renderField(
                    "Department",
                    "department",
                    <Controller
                      name="department"
                      control={control}
                      render={({ field }) => (
                        <Select
                          value={field.value}
                          onValueChange={(value) => field.onChange(value)}
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="Select department" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectGroup>
                              <SelectLabel>Department</SelectLabel>
                              <SelectItem value="College of Technology and Engineering">
                                College of Technology and Engineering
                              </SelectItem>
                              <SelectItem value="College of Education">
                                College of Education
                              </SelectItem>
                              <SelectItem value="College of Arts and Sciences">
                                College of Arts and Sciences
                              </SelectItem>
                              <SelectItem value="College of Hospitality Management and Tourism">
                                College of Hospitality Management and Tourism
                              </SelectItem>
                              <SelectItem value="College of Agriculture">
                                College of Agriculture
                              </SelectItem>
                              <SelectItem value="College of Forestry">
                                College of Forestry
                              </SelectItem>
                            </SelectGroup>
                          </SelectContent>
                        </Select>
                      )}
                    />
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

export default EditRequisitionerForm;
