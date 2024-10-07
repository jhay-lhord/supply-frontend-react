import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { PlusIcon, MinusCircledIcon } from "@radix-ui/react-icons";
import { useForm, useFieldArray } from "react-hook-form";
import { ItemData, itemSchema } from "@/types/request/item";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Description } from "@radix-ui/react-dialog";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useQueryClient, useMutation} from "@tanstack/react-query";
import { AddItem } from "@/services/itemServices";

interface ItemFormProps {
  isItemDialogOpen: boolean;
  setIsItemDialogOpen: (open: boolean) => void;
  pr_no: string;
}

const ItemForm: React.FC<ItemFormProps> = ({
  isItemDialogOpen,
  setIsItemDialogOpen,
  pr_no,
}) => {
  const {
    control,
    register,
    handleSubmit,setValue,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(itemSchema),
    defaultValues: {
      items: [
        {
          purchase_request: pr_no,
          item_no: "",
          item_property: "",
          unit: "",
          item_description: "",
          quantity: 0,
          unit_cost: 0,
          total_cost: 0,
        },
      ],
    },
  });

  const queryClient = useQueryClient()

  const addItemMutation = useMutation({
    mutationFn: AddItem,
    onSuccess: () => {
      queryClient.invalidateQueries({queryKey: ['items']})
      console.log('refetch and invalidated')
    }

  });

  const {
    fields: items,
    append,
    remove,
  } = useFieldArray({
    control,
    name: "items",
  });
  console.log(errors);
  console.log(pr_no);

  const onAddItem = () => {
    append({
      purchase_request: pr_no,
      item_no: "",
      item_property: "",
      unit: "",
      item_description: "",
      quantity: 0,
      unit_cost: 0,
      total_cost: 0,
    });
  
    items.forEach((_, index) => {
      setValue(`items.${index}.purchase_request`, pr_no);
    });
  }

  const onSubmit = async (data: { items: ItemData[] }, pr_no: string) => {
    console.log("submitted");
    console.log(`Pr Number: ${pr_no}`);
    console.log(pr_no);
    console.log(data);

    try {
      const itemsWithPurchaseRequest = data.items.map((item) => ({
        ...item,
        purchase_request: pr_no, 
      }));

        console.log(itemsWithPurchaseRequest)
      itemsWithPurchaseRequest.forEach(async (item) => {
        console.log(item);
        const result = itemSchema.safeParse({ items: [item] });
        console.log(result);

        if (!result.success) {
          console.log("Validation failed:", result.error.flatten());
          return;
        }

        console.log("submitted");
        addItemMutation.mutate(item)
        await AddItem(item)

        // const response = await api.post("api/item/", item);

        // console.log(response);
      });
    } catch (error) {
      console.log(error);
    }
  };
  return (
    <Dialog open={isItemDialogOpen} onOpenChange={setIsItemDialogOpen}>
      <DialogContent className="max-w-full w-[60rem]">
        <DialogHeader>
          <DialogTitle className="py-6">
            Add Item In Purchase Request
          </DialogTitle>
          <p>Purchase Number: {pr_no}</p>
        </DialogHeader>
        <Description>
          <form onSubmit={handleSubmit((data) => onSubmit(data, pr_no))}>
            {/* Add Item Button */}
            <Button
              className="fixed right-10 top-20 z-50 hover:bg-orange-200"
              variant="secondary"
              onClick={onAddItem}
              type="button"
            >
              <PlusIcon className="mr-2" /> Add Item
            </Button>

            {/* Items Fields */}
            <div className="">
              <div className="grid grid-cols-8 gap-2 mb-4 items-center sticky top-0 bg-white">
                <Label>Item No</Label>
                <Label>Item Property</Label>
                <Label>Unit</Label>
                <Label>Description</Label>
                <Label>Quantity</Label>
                <Label>UnitCost</Label>
                <Label>TotalCost</Label>
              </div>
              <ScrollArea className="h-[30rem]">
                {items.map((item, index) => (
                  <div
                    key={item.id}
                    className="grid grid-cols-8 gap-2 mb-4 items-center"
                  >
                    <div>
                      <Input
                        {...register(`items.${index}.item_no` as const)}
                        defaultValue={index + 1}
                      />
                      {errors.items?.[index]?.item_no && (
                        <span className="text-xs text-red-500">
                          {errors.items[index].item_no?.message}
                        </span>
                      )}
                    </div>

                    <div>
                      <Input
                        {...register(`items.${index}.item_property` as const)}
                      />
                      {errors.items?.[index]?.item_property && (
                        <span className="text-xs text-red-500">
                          {errors.items[index].item_property?.message}
                        </span>
                      )}
                    </div>

                    <div>
                      <Input {...register(`items.${index}.unit` as const)} />
                      {errors.items?.[index]?.unit && (
                        <span className="text-xs text-red-500">
                          {errors.items[index].unit?.message}
                        </span>
                      )}
                    </div>

                    <div>
                      <Input
                        {...register(
                          `items.${index}.item_description` as const
                        )}
                      />
                      {errors.items?.[index]?.item_description && (
                        <span className="text-xs text-red-500">
                          {errors.items[index].item_description?.message}
                        </span>
                      )}
                    </div>

                    <div>
                      <Input
                        {...register(`items.${index}.quantity` as const, {
                          valueAsNumber: true,
                        })}
                        type="number"
                        defaultValue={item.quantity}
                      />
                      {errors.items?.[index]?.quantity && (
                        <span className="text-xs text-red-500">
                          {errors.items[index].quantity?.message}
                        </span>
                      )}
                    </div>

                    <div>
                      <Input
                        {...register(`items.${index}.unit_cost` as const, {
                          valueAsNumber: true,
                        })}
                        type="number"
                        defaultValue={item.unit_cost}
                      />
                      {errors.items?.[index]?.unit_cost && (
                        <span className="text-xs text-red-500">
                          {errors.items[index].unit_cost?.message}
                        </span>
                      )}
                    </div>

                    <Input
                      {...register(`items.${index}.total_cost` as const, {
                        valueAsNumber: true,
                      })}
                      type="number"
                    />

                    <MinusCircledIcon
                      className="ml-5 text-lg w-8 h-8 text-red-200 hover:text-red-300"
                      onClick={() => remove(index)}
                    />
                  </div>
                ))}
              </ScrollArea>
            </div>

            {/* Submit Button */}
            <div className="mt-6 fixed bottom-6 right-10">
              <Button
                className="text-slate-950 bg-orange-200 hover:bg-orange-300"
                type="submit"
              >
                Submit Item
              </Button>
            </div>
          </form>
        </Description>
      </DialogContent>
    </Dialog>
  );
};

export default ItemForm;
