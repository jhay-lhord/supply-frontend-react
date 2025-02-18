import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { useForm } from "react-hook-form";
import { ItemType, itemSchema } from "@/types/request/item";
import { zodResolver } from "@hookform/resolvers/zod";
import { useAddItem } from "@/services/itemServices";
import { generateStockPropertyNo } from "@/services/generateStockPropertyNo";
import { Loader2 } from "lucide-react";
import { FilteredItemInPurchaseRequest } from "@/services/itemServices";
import { arraySort } from "@/services/itemServices";
import { v4 as uuidv4 } from "uuid";
import useStatusStore from "@/store";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { MessageDialog } from "../../shared/components/MessageDialog";
import { RESTRICTED_ACTION_STATUS } from "@/constants";

interface ItemFormProps {
  pr_no: string;
}

interface messageDialogProps {
  open: boolean;
  message: string;
  type: "success" | "error" | "info";
  title: string;
}

const ItemForm: React.FC<ItemFormProps> = ({ pr_no }) => {
  const [messageDialog, setMessageDialog] = useState<messageDialogProps>({
    open: false,
    type: "success" as const,
    title: "",
    message: "",
  });

  const items = FilteredItemInPurchaseRequest(pr_no) ?? [];
  const sortedItems = arraySort(items!.map(item => ({
    ...item,
    purchase_request: pr_no
  })), "stock_property_no");
  const nextStockNo = generateStockPropertyNo(sortedItems).toString();
  const item_no = uuidv4();
  const {
    register,
    handleSubmit,
    setValue,
    getValues,
    reset,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(itemSchema),
    defaultValues: {
      purchase_request: pr_no,
      item_no: item_no,
      stock_property_no: nextStockNo,
      unit: "",
      item_description: "",
      quantity: 0,
      unit_cost: 0,
      total_cost: 0,
    },
  });

  useEffect(() => {
    setValue("item_no", item_no);
    setValue("stock_property_no", nextStockNo);
  }, [nextStockNo, item_no, setValue]);

  const { mutate, isPending } = useAddItem();
  const { status } = useStatusStore();

  const addItemDisabled = RESTRICTED_ACTION_STATUS.includes(status!);

  const onSubmit = async (data: ItemType) => {
    try {
      const result = itemSchema.safeParse({
        ...data,
        item_no: item_no,
        stock_property_no: nextStockNo,
      });

      if (result.success) {
        mutate(data, {
          onSuccess: (response) => {
            if (response.status === "success") {
              setMessageDialog({
                open: true,
                message: "Item Added Successfully",
                title: "Success",
                type: "success",
              });
              reset();
            }
          },
          onError: (error) => {
            setMessageDialog({
              open: true,
              message: error.message,
              title: "Error",
              type: "error",
            });
          },
        });
        reset();
      }
    } catch (error) {
      console.log(error);
    }
  };
  return (
    <form onSubmit={handleSubmit((data) => onSubmit(data))}>
      <div className="">
        <div className="grid grid-cols-7 gap-2 mb-4 items-center">
          <Label className="text-base">Unit</Label>
          <Label className="col-span-2 text-base">Description</Label>
          <Label className="text-base">Quantity</Label>
          <Label className="text-base">UnitCost</Label>
          <Label className="text-base">TotalCost</Label>
        </div>

        <div className="grid grid-cols-7 gap-2 mb-4">
          <div>
            <Input {...register("unit")} disabled={isPending}/>
            {errors?.unit && (
              <span className="text-xs text-red-500">
                {errors?.unit?.message}
              </span>
            )}
          </div>

          <div className="col-span-2">
            <Input {...register("item_description")} disabled={isPending}/>
            {errors?.item_description && (
              <span className="text-xs text-red-500">
                {errors?.item_description?.message}
              </span>
            )}
          </div>

          <div>
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
              disabled={isPending}
            />
            {errors?.quantity && (
              <span className="text-xs text-red-500">
                {errors?.quantity?.message}
              </span>
            )}
          </div>

          <div>
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
              disabled={isPending}
            />
            {errors?.unit_cost && (
              <span className="text-xs text-red-500">
                {errors?.unit_cost?.message}
              </span>
            )}
          </div>

          <Input
            {...register("total_cost", {
              valueAsNumber: true,
            })}
            type="number"
            value={getValues("quantity") * getValues("unit_cost")}
            readOnly
            disabled={isPending}
          />

          <TooltipProvider delayDuration={100} skipDelayDuration={200}>
            <Tooltip>
              <TooltipTrigger asChild>
                <div>
                  <Button
                    disabled={addItemDisabled}
                    className="flex bg-orange-200 hover:rounded-full text-gray-950"
                  >
                    <p className="mx-1 text-sm font-thin">
                      {isPending ? (
                        <Loader2 className="animate-spin" />
                      ) : (
                        "Add Item"
                      )}
                    </p>
                    <span className="sr-only">Add Items</span>
                  </Button>
                </div>
              </TooltipTrigger>
              <TooltipContent side="top">
                {addItemDisabled
                  ? `You cannot add new items to this purchase request because it has already been ${status}`
                  : "Click to add Items"}
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </div>
      </div>

      <MessageDialog
        message={messageDialog?.message}
        title={messageDialog?.title}
        type={messageDialog?.type}
        open={messageDialog?.open}
        onOpenChange={(open) => setMessageDialog((prev) => ({ ...prev, open }))}
      />
    </form>
  );
};

export default ItemForm;
