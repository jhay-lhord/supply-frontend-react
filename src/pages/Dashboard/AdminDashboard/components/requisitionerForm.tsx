import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Controller, useForm } from "react-hook-form";
import { v4 as uuidv4 } from "uuid";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  requisitionerSchema,
  RequisitionerType,
} from "@/types/request/requisitioner";
import {
  useAddRequisitioner,
  useGetAllRequisitioner,
} from "@/services/requisitionerServices";
import { Loader2 } from "lucide-react";
import { DataTable } from "./data-table";
import { requisitioner_columns } from "./requisitioner-column";
import Loading from "../../shared/components/Loading";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useMemo } from "react";

const RequisitionerForm = () => {
  const {
    register,
    handleSubmit,
    reset,
    control,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(requisitionerSchema),
    defaultValues: {
      requisition_id: uuidv4(),
      first_name: "",
      last_name: "",
      middle_name: "",
      name: "",
      gender: "",
      department: "",
      designation: "",
    },
  });

  const { data, isLoading } = useGetAllRequisitioner();
  const requisitioner_data = useMemo(() => {
    return Array.isArray(data?.data) ? data.data : [];
  }, [data?.data]);
  const { mutate, isPending } = useAddRequisitioner();

  if (isLoading) return <Loading />;

  const onSubmit = async (data: RequisitionerType) => {
    const requisition_id = uuidv4();
    try {
      const result = requisitionerSchema.safeParse({
        ...data,
        requisition_id: requisition_id,
        name: `${data.last_name}, ${data.first_name} ${data.middle_name}`,
      });

      if (result.success) {
        mutate({
          requisition_id: requisition_id,
          first_name: data.first_name,
          last_name: data.last_name,
          middle_name: data.middle_name,
          name: `${data.last_name.toUpperCase()}, ${data.first_name.toUpperCase()} ${data.middle_name?.toUpperCase()}`,
          gender: data.gender,
          department: data.department,
          designation: data.designation,
        });
        console.log(data);
        reset({
          requisition_id: uuidv4(), // Update default value with the new UUID
          first_name: "",
          last_name: "",
          middle_name: "",
          gender: "",
          department: "",
          designation: "",
        });
      }
    } catch (error) {
      console.log(error);
    }
  };

  const renderField = (
    label: string,
    name: keyof RequisitionerType,
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
    <>
      <form
        className="m-6 p-6 bg-slate-100 rounded"
        onSubmit={handleSubmit((data) => onSubmit(data))}
      >
        <div className="">
          <div className="grid grid-cols-3 gap-2 mb-4">
            {renderField(
              "First Name",
              "first_name",
              <Input {...register("first_name")} />
            )}

            {renderField(
              "Last Name",
              "last_name",
              <Input {...register("last_name")} />
            )}

            {renderField(
              "Middle Initial",
              "middle_name",
              <Input {...register("middle_name")} />
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

            <Button
              className="text-slate-950 bg-orange-200 hover:bg-orange-300"
              type="submit"
            >
              {isPending ? (
                <Loader2 className="animate-spin" />
              ) : (
                "Add Requisitioner"
              )}
            </Button>
          </div>
        </div>
      </form>
      <DataTable data={requisitioner_data} columns={requisitioner_columns} />
    </>
  );
};

export default RequisitionerForm;
