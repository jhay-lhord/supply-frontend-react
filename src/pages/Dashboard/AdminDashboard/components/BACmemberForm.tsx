import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { useForm } from "react-hook-form";
import { v4 as uuidv4 } from "uuid";
import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2 } from "lucide-react";
import { DataTable } from "./data-table";
import Loading from "../../shared/components/Loading";

import { BACmemberSchema, BACmemberType } from "@/types/request/BACmember";
import {
  useAddBACmember,
  useGetAllBACmember,
} from "@/services/BACmemberServices";

import { BACmember_columns } from "./BACmember-column";
import { useMemo } from "react";

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
      first_name: "",
      last_name: "",
      middle_name: "",
      name: "",
      designation: "",
    },
  });

  const { data, isLoading } = useGetAllBACmember();
  const BACmember_data = useMemo(() => {
    return Array.isArray(data?.data) ? data.data : [];
  }, [data?.data])
  const { mutate, isPending } = useAddBACmember();

  if (isLoading) return <Loading />;

  const onSubmit = async (data: BACmemberType) => {
    const member_id = uuidv4();
    try {
      const result = BACmemberSchema.safeParse({
        ...data,
        member_id: member_id,
        name: `${data.last_name}, ${data.first_name} ${data.middle_name}`
      });

      if (result.success) {
        mutate({
          member_id,
          first_name: data.first_name,
          last_name: data.last_name,
          middle_name: data.middle_name,
          name: `${data.last_name.toUpperCase()}, ${data.first_name.toUpperCase()} ${data.middle_name?.toUpperCase()}`,
          designation: data.designation
        });
        reset({
          member_id: uuidv4(), // Update default value with the new UUID
          first_name: "",
          last_name: "",
          middle_name: "",
          designation: "",
        });
      }
    } catch (error) {
      console.log(error);
    }
  };

  const renderField = (
    label: string,
    name: keyof BACmemberType,
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
        <div className="grid grid-cols-3 gap-2 mb">
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
            "Designation",
            "designation",
            <Input {...register("designation")} />
          )}
        </div>
        <Button
          className="text-slate-950 bg-orange-200 hover:bg-orange-300"
          type="submit"
        >
          {isPending ? <Loader2 className="animate-spin" /> : "Add BAC Member"}
        </Button> 
      </form>
      <DataTable data={BACmember_data} columns={BACmember_columns} />
    </>
  );
};

export default BACmemberForm;
