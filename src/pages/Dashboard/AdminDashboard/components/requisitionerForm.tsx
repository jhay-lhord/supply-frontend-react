import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { useForm } from "react-hook-form";
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

const RequisitionerForm = () => {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(requisitionerSchema),
    defaultValues: {
      requisition_id: uuidv4(),
      name: "",
      gender: "",
      department: "",
      designation: "",
    },
  });

  const { data, isLoading } = useGetAllRequisitioner();
  const requisitioner_data = Array.isArray(data?.data) ? data.data : [];
  const { mutate, isPending } = useAddRequisitioner();

  if(isLoading) return <Loading/>

  const onSubmit = async (data: RequisitionerType) => {
    const requisition_id = uuidv4()
    try {
      const result = requisitionerSchema.safeParse({
        ...data,
        requisition_id: requisition_id,
      });

      if (result.success) {
        mutate(data);
        reset({
          requisition_id: uuidv4(), // Update default value with the new UUID
          name: "",
          gender: "",
          department: "",
          designation: "",
        });
      }
    } catch (error) {
      console.log(error);
    }
  };
  return (
    <>
      <form className="m-6 p-6 bg-slate-100 rounded" onSubmit={handleSubmit((data) => onSubmit(data))}> 
        <div className="">
          <div className="grid grid-cols-5 gap-2 mb-4 items-center">
            <Label className="text-base">Name</Label>
            <Label className="text-base">Gender</Label>
            <Label className="text-base">Department</Label>
            <Label className="text-base">Designation</Label>
          </div>

          <div className="grid grid-cols-5 gap-2 mb-4">
            <div>
              <Input {...register("name")} />
              {errors?.name && (
                <span className="text-xs text-red-500">
                  {errors?.name?.message}
                </span>
              )}
            </div>

            <div>
              <Input {...register("gender")} />
              {errors?.gender && (
                <span className="text-xs text-red-500">
                  {errors?.gender?.message}
                </span>
              )}
            </div>

            <div>
              <Input {...register("department")} />
              {errors?.department && (
                <span className="text-xs text-red-500">
                  {errors?.department?.message}
                </span>
              )}
            </div>

            <div>
              <Input {...register("designation")} />
              {errors?.designation && (
                <span className="text-xs text-red-500">
                  {errors?.designation?.message}
                </span>
              )}
            </div>

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
