import { useEffect } from "react";
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


interface ItemFormProps {
  pr_no: string;
}

const ItemForm: React.FC<ItemFormProps> = ({ pr_no }) => {
  const items = FilteredItemInPurchaseRequest(pr_no)
  const stockPropertyNo = generateStockPropertyNo(items!).toString()
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
      item_no: generateStockPropertyNo(items!).toString(),
      stock_property_no: generateStockPropertyNo(items!).toString(),
      unit: "",
      item_description: "",
      quantity: 0,
      unit_cost: 0,
      total_cost: 0,
    },
  });


  console.log(generateStockPropertyNo(items!))
  console.log(errors)

  useEffect(() => {
    setValue("item_no", stockPropertyNo);
    setValue("stock_property_no", stockPropertyNo);
  }, [stockPropertyNo, setValue]);


  const {mutate, isPending} = useAddItem()

  const onSubmit = async (data: ItemType) => {
    try {
  
      const result = itemSchema.safeParse({
        ...data,
        item_no: stockPropertyNo,
        stock_property_no: stockPropertyNo
      });


      if (result.success) {
        mutate(data);

        reset();
      }
    } catch (error) {
      console.log(error);
    }
  };
  return (
   
    <form onSubmit={handleSubmit((data) => onSubmit(data))}>
      <div className="">
        <div className="grid grid-cols-7 gap-2 mb-4 items-center bg-white">
          <Label>Unit</Label>
          <Label>Description</Label>
          <Label>Quantity</Label>
          <Label>UnitCost</Label>
          <Label>TotalCost</Label>
        </div>
      
        <div className="grid grid-cols-7 gap-2 mb-4 items-center">

          <div>
            <Input {...register("unit")} />
            {errors?.unit && (
              <span className="text-xs text-red-500">
                {errors?.unit?.message}
              </span>
            )}
          </div>

          <div>
            <Input {...register("item_description")} />
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
          />

          <Button
            className="text-slate-950 bg-orange-200 hover:bg-orange-300"
            type="submit"
          >
            {isPending ? <Loader2 className="animate-spin" /> : "Add Item"}
          </Button>
        </div>
      </div>
    </form>
  );
};

export default ItemForm;
