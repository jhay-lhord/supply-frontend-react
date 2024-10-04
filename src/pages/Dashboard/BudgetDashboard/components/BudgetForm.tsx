import React from "react";
import api from "@/api";
import { useForm, useFieldArray } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { ScrollArea } from "@/components/ui/scroll-area";
import { PlusIcon, MinusCircledIcon } from "@radix-ui/react-icons";

import {
  purchaseRequestFormSchema,
  type PurchaseRequestData,
} from "@/types/request/purchase-request";
import { Description } from "@radix-ui/react-dialog";

interface PurchaseRequestFormProps {
  isDialogOpen: boolean;
  setIsDialogOpen: (open: boolean) => void;
  lastPrNo: string;
}

const BudgetForm: React.FC<PurchaseRequestFormProps> = ({
  isDialogOpen,
  setIsDialogOpen,
  lastPrNo,
}) => {
  const {
    register,
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<PurchaseRequestData>({
    resolver: zodResolver(purchaseRequestFormSchema),
  });

  const {
    fields: items,
    append,
    remove,
  } = useFieldArray({
    control,
    name: "items",
  });

  const generateNextPrNo = () => {
    const currentDate = new Date();
    const currentMonth = currentDate.getMonth() + 1;
    const currentMonthFormatted = currentMonth < 10 ? `0${currentMonth}` : currentMonth;
    console.log(currentMonthFormatted);
    const currentYear = currentDate.getFullYear();
    let currentDigitInPr;
    console.log(currentDigitInPr);
    console.log(currentMonth);
    console.log(currentDate);

    if (!lastPrNo) {
      currentDigitInPr = 0;//set to 0 if the database is empty or first use 
      return `${currentYear}${currentMonthFormatted}${currentDigitInPr}`;
    } else {
      currentDigitInPr = parseInt(lastPrNo.substring(6), 10);
      console.log(`Last PR No: ${lastPrNo}`);
      return `${currentYear}${currentMonthFormatted}${currentDigitInPr + 1}`;
    }
  };

  generateNextPrNo();

  const onSubmit = async (data: PurchaseRequestData) => {
    try {
      const result = purchaseRequestFormSchema.safeParse(data);
      console.log(result);

      if (result.success) {
        console.log("no errors");
        setIsDialogOpen(false);

        const purchaseRequestResponse = await api.post(
          "/api/purchase-request/",
          {
            pr_no: data.pr_no,
            res_center_code: data.res_center_code,
            purpose: data.purpose,
            status: data.status,
            requested_by: data.requested_by,
            approved_by: data.approved_by,
          }
        );

        const purchaseRequestPRNo = purchaseRequestResponse.data.pr_no;

        const itemRequests = data.items.map((item) =>
          api.post("/api/item/", item).then((itemResponse) => {
            const itemId = itemResponse.data.item_no;
            return api.post("/api/purchase-request-item/", {
              item: itemId,
              purchase_request: purchaseRequestPRNo,
            });
          })
        );

        await Promise.all(itemRequests);
        console.log(errors);

        console.log("Purchase request and items saved successfully.");
      }
    } catch (error) {
      console.error("Error saving purchase request and items:", error);
    }
  };

  return (
    <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
      <DialogContent className="max-w-full w-[60rem]">
        <ScrollArea className="h-[35rem] mb-8">
          <DialogHeader>
            <DialogTitle className="py-6">Create Purchase Request</DialogTitle>
          </DialogHeader>
          <Description>
            <form onSubmit={handleSubmit(onSubmit)}>
              {/* Purchase Request Fields */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Input
                    placeholder="PR No"
                    {...register("pr_no")}
                    value={generateNextPrNo()}
                  />
                  {errors.pr_no && (
                    <span className="text-red-400 text-xs">
                      {errors.pr_no.message}
                    </span>
                  )}
                </div>

                <div>
                  <Input
                    placeholder="Res Center Code"
                    {...register("res_center_code")}
                  />
                  {errors.res_center_code && (
                    <span className="text-red-400 text-xs">
                      {errors.res_center_code.message}
                    </span>
                  )}
                </div>

                <div>
                  {" "}
                  <Input placeholder="Purpose" {...register("purpose")} />
                  {errors.purpose && (
                    <span className="text-red-400 text-xs">
                      {errors.purpose.message}
                    </span>
                  )}
                </div>

                <div>
                  <Input placeholder="Status" {...register("status")} />
                  {errors.status && (
                    <span className="text-red-400 text-xs">
                      {errors.status.message}
                    </span>
                  )}
                </div>

                <div>
                  <Input
                    placeholder="Requested By"
                    {...register("requested_by")}
                  />
                  {errors.requested_by && (
                    <span className="text-red-400 text-xs">
                      {errors.requested_by.message}
                    </span>
                  )}
                </div>

                <div>
                  <Input
                    placeholder="Approved By"
                    {...register("approved_by")}
                  />
                  {errors.approved_by && (
                    <span className="text-red-400 text-xs">
                      {errors.approved_by.message}
                    </span>
                  )}
                </div>
              </div>

              {/* Add Item Button */}
              <Button
                className="fixed right-0 m-6 hover:bg-orange-200"
                variant="secondary"
                onClick={() =>
                  append({
                    item_no: "",
                    item_property: "",
                    unit: "",
                    item_description: "",
                    quantity: "",
                    unit_cost: "",
                    total_cost: "",
                  })
                }
                type="button"
              >
                <PlusIcon className="mr-2" /> Add Item
              </Button>

              {/* Items Fields */}
              <div className="mt-20">
                <div className="grid grid-cols-8 gap-2 mb-4 items-center sticky top-0 bg-white">
                  <Label>Item No</Label>
                  <Label>Item Property</Label>
                  <Label>Unit</Label>
                  <Label>Description</Label>
                  <Label>Quantity</Label>
                  <Label>UnitCost</Label>
                  <Label>TotalCost</Label>
                </div>

                {items.map((item, index) => (
                  <div
                    key={item.id}
                    className="grid grid-cols-8 gap-2 mb-4 items-center"
                  >
                    <div>
                      <Input {...register(`items.${index}.item_no` as const)} defaultValue={index + 1}/>
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
                        {...register(`items.${index}.quantity` as const)}
                        type="number"
                      />
                      {errors.items?.[index]?.quantity && (
                        <span className="text-xs text-red-500">
                          {errors.items[index].quantity?.message}
                        </span>
                      )}
                    </div>

                    <div>
                      <Input
                        {...register(`items.${index}.unit_cost` as const)}
                        type="number"
                      />
                      {errors.items?.[index]?.unit_cost && (
                        <span className="text-xs text-red-500">
                          {errors.items[index].unit_cost?.message}
                        </span>
                      )}
                    </div>

                    <Input
                      {...register(`items.${index}.total_cost` as const)}
                      type="number"
                    />

                    <MinusCircledIcon
                      className="ml-5 text-lg w-8 h-8 text-red-200 hover:text-red-300"
                      onClick={() => remove(index)}
                    />
                  </div>
                ))}
              </div>

              {/* Submit Button */}
              <div className="mt-6 fixed bottom-6 right-10">
                <Button
                  className="text-slate-950 bg-orange-200 hover:bg-orange-300"
                  type="submit"
                >
                  Submit Purchase Request
                </Button>
              </div>
            </form>
          </Description>
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
};

export default BudgetForm;
