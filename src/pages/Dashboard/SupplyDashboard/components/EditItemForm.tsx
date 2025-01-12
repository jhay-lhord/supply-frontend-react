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
import { Textarea } from "@/components/ui/textarea";
import { Description } from "@radix-ui/react-dialog";
import { itemSchema, ItemType } from "@/types/request/item";
import { useGetItem, useUpdateItem } from "@/services/itemServices";
import Loading from "../../shared/components/Loading";
import { Loader2 } from "lucide-react";
import { MessageDialog } from "../../shared/components/MessageDialog";

interface EditItemFormProps {
  isEditDialogOpen: boolean;
  setIsEditDialogOpen: (open: boolean) => void;
  item_no: string;
}

interface messageDialogProps {
  open: boolean;
  message: string;
  type: "success" | "error" | "info";
  title: string;
}

const EditItemForm: React.FC<EditItemFormProps> = ({
  isEditDialogOpen,
  setIsEditDialogOpen,
  item_no,
}) => {
  const [isEditLoading, setIsEditLoading] = useState<boolean>(false);
  const [messageDialog, setMessageDialog] = useState<messageDialogProps>({
    open: false,
    type: "success" as const,
    title: "",
    message: "",
  });

  const { isLoading, data: item } = useGetItem(item_no!);
  const { mutate } = useUpdateItem();
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
    getValues,
    setValue,
  } = useForm<ItemType>({
    resolver: zodResolver(itemSchema),
    defaultValues: {
      item_no: item?.data?.item_no,
      purchase_request: item?.data?.pr_details.pr_no,
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
      setValue("purchase_request", item?.data?.pr_details.pr_no);
      setValue("stock_property_no", item?.data?.stock_property_no);
      setValue("unit", item?.data?.unit);
      setValue("item_description", item?.data?.item_description);
      setValue("quantity", item?.data?.quantity);
      setValue("unit_cost", item?.data?.unit_cost);
      setValue("total_cost", item?.data?.total_cost);
    }
  }, [item, setValue]);

  const onSubmit = async (data: ItemType) => {
    setIsEditLoading(true);

    try {
      const result = itemSchema.safeParse(data);

      if (result.success) {
        await mutate(data, {
          onSuccess: (response) => {
            if (response.status === "success") {
              setIsEditDialogOpen(false);
              setIsEditDialogOpen(false);
              reset();

              setMessageDialog({
                open: true,
                message: "Item Edited Successfully",
                title: "success",
                type: "success",
              });
            } else {
              setIsEditDialogOpen(false);
              setIsEditDialogOpen(false);
              reset();

              setMessageDialog({
                open: true,
                message: "Something went wrong, please try again",
                title: "Error",
                type: "error",
              });
            }
          },
          onError: (error) => {
            setIsEditDialogOpen(false);
            setIsEditDialogOpen(false);
            reset();

            setMessageDialog({
              open: true,
              message: error.message,
              title: "Error",
              type: "error",
            });
          },
        });
      }
    } catch (error) {
      console.log(error);
    }
  };


  const renderField = (
    label: string,
    name: keyof ItemType,
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
                <form onSubmit={handleSubmit((item) => onSubmit(item))}>
                  <div className=" gap-2 mb-4">
                    {renderField(
                      "Unit",
                      "unit",
                      <Input {...register("unit")} />
                    )}

                    {renderField(
                      "Description",
                      "item_description",
                      <Textarea {...register("item_description")} />
                    )}


                    <div className="mb-4">
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

                    <div className="mb-4">
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

                    <div className="mt-6 fixed bottom-6 right-6">
                      <Button
                        className="text-slate-950 bg-orange-200 hover:bg-orange-300 px-10"
                        type="submit"
                        disabled={isEditLoading}
                      >
                        {isEditLoading ? (
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

      <MessageDialog
        message={messageDialog?.message}
        title={messageDialog?.title}
        type={messageDialog?.type}
        open={messageDialog?.open}
        onOpenChange={(open) => setMessageDialog((prev) => ({ ...prev, open }))}
      />
    </>
  );
};

export default EditItemForm;
