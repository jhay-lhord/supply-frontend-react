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
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Description } from "@radix-ui/react-dialog";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { itemSchema, ItemType } from "@/types/request/item";
import { UpdateItem, useGetItem } from "@/services/itemServices";
import Loading from "../../shared/components/Loading";

interface EditItemFormProps {
  isEditDialogOpen: boolean;
  setIsEditDialogOpen: (open: boolean) => void;
  item_no: string;
}

const EditItemForm: React.FC<EditItemFormProps> = ({
  isEditDialogOpen,
  setIsEditDialogOpen,
  item_no,
}) => {
  const { isLoading, data: item } = useGetItem(item_no!);
  const {
    register,
    handleSubmit,
    formState: { errors },
    getValues,
    setValue,
  } = useForm<ItemType>({
    resolver: zodResolver(itemSchema),
    defaultValues: {
      item_no: item?.data?.item_no,
      purchase_request: item?.data?.purchase_request,
      stock_property_no: item?.data?.stock_property_no,
      unit: item?.data?.unit,
      item_description: item?.data?.item_description,
      quantity: item?.data?.quantity,
      unit_cost: item?.data?.unit_cost,
      total_cost: item?.data?.total_cost,
    },
  });

  useEffect(() => {
    if (item?.data) {
      setValue("item_no", item?.data?.item_no);
      setValue("purchase_request", item?.data?.purchase_request);
      setValue("stock_property_no", item?.data?.stock_property_no);
      setValue("unit", item?.data?.unit);
      setValue("item_description", item?.data?.item_description);
      setValue("quantity", item?.data?.quantity);
      setValue("unit_cost", item?.data?.unit_cost);
      setValue("total_cost", item?.data?.total_cost);
    }
  }, [item, setValue]);
  const queryClient = useQueryClient();
  console.log(item);

  const updateItemMutation = useMutation({
    mutationFn: UpdateItem,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["items"] });
      toast.success("Edit Successfully", {
        description: "Item Edit Successfully",
      });
      setIsEditDialogOpen(false);
      // reset();
    },
  });

  console.log(errors);

  const onSubmit = (item: ItemType) => {
    updateItemMutation.mutate(item);
  };

  return (
    <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
      <DialogContent className="max-w-full w-[40rem]">
        <ScrollArea className="h-[30rem] mb-8">
          <DialogHeader>
            <DialogTitle className="py-6">Edit Item</DialogTitle>
          </DialogHeader>
          <Description>
            {isLoading ? (
              <Loading />
            ) : (
              <form onSubmit={handleSubmit(onSubmit)}>
                <div className="">
                  <div className="grid grid-cols-7 gap-2 mb-4 items-center bg-white"></div>

                  <div className=" gap-2 mb-4">
                    <div>
                      <Label>Unit</Label>
                      <Input {...register("unit")} />
                      {errors?.unit && (
                        <span className="text-xs text-red-500">
                          {errors?.unit?.message}
                        </span>
                      )}
                    </div>

                    <div className="col-span-2">
                      <Label>Description</Label>

                      <Textarea {...register("item_description")} />
                      {errors?.item_description && (
                        <span className="text-xs text-red-500">
                          {errors?.item_description?.message}
                        </span>
                      )}
                    </div>

                    <div>
                      <Label>Quantity</Label>
                      <Input
                        {...register("quantity", {
                          valueAsNumber: true,
                          onChange: (e) => {
                            const quantity = Number(e.target.value);
                            const unitCost = getValues("unit_cost");
                            setValue("quantity", quantity);
                            setValue("total_cost", quantity * unitCost);
                          },
                        })}
                        type="number"
                        defaultValue={getValues("quantity")}
                      />
                      {errors?.quantity && (
                        <span className="text-xs text-red-500">
                          {errors?.quantity?.message}
                        </span>
                      )}
                    </div>

                    <div>
                      <Label>UnitCost</Label>
                      <Input
                        {...register("unit_cost", {
                          valueAsNumber: true,
                          onChange: (e) => {
                            const unitCost = Number(e.target.value);
                            const quantity = getValues("quantity");
                            setValue("unit_cost", unitCost);
                            setValue("total_cost", quantity * unitCost);
                          },
                        })}
                        type="number"
                        defaultValue={getValues("unit_cost")}
                      />
                      {errors?.unit_cost && (
                        <span className="text-xs text-red-500">
                          {errors?.unit_cost?.message}
                        </span>
                      )}
                    </div>
                    <Label>TotalCost</Label>
                    <Input
                      {...register("total_cost", {
                        valueAsNumber: true,
                      })}
                      type="number"
                      value={getValues("quantity") * getValues("unit_cost")}
                      readOnly
                    />

                    <div className="mt-6 fixed bottom-6 right-10">
                      <Button
                        className="text-slate-950 bg-orange-200 hover:bg-orange-300"
                        type="submit"
                      >
                        Save Changes
                      </Button>
                    </div>
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

export default EditItemForm;
