import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { useForm } from "react-hook-form";
import { v4 as uuidv4 } from "uuid";
import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2 } from "lucide-react";
import { DataTable } from "./data-table";
import Loading from "../../shared/components/Loading";

import { BACmemberSchema, BACmemberType} from "@/types/request/BACmember";
import { useAddBACmember, useGetAllBACmember } from "@/services/BACmemberServices";

import { BACmember_columns } from "./BACmember-column";


const BACmemberForm = () => {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(BACmemberSchema),
    defaultValues: {
      member_id: uuidv4(),
      name: "",
      designation: "",
    },
  });

  const { data, isLoading } = useGetAllBACmember();
  const BACmember_data = Array.isArray(data?.data) ? data.data : [];
  const { mutate, isPending } = useAddBACmember();

  if(isLoading) return <Loading/>

  const onSubmit = async (data: BACmemberType) => {
    const member_id = uuidv4()
    try {
      const result = BACmemberSchema.safeParse({
        ...data,
        member_id: member_id,
      });

      if (result.success) {
        mutate(data);
        reset({
          member_id: uuidv4(), // Update default value with the new UUID
          name: "",
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
          <div className="grid grid-cols-3 gap-2 mb-4 items-center">
            <Label className="text-base">Name</Label>
            <Label className="text-base">Designation</Label>
          </div>

          <div className="grid grid-cols-3 gap-2 mb-4">
            <div>
              <Input {...register("name")} />
              {errors?.name && (
                <span className="text-xs text-red-500">
                  {errors?.name?.message}
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
                "Add Campus Director"
              )}
            </Button>
          </div>
        </div>
      </form>
      <DataTable data={BACmember_data} columns={BACmember_columns} />
    </>
  );
};

export default BACmemberForm;
