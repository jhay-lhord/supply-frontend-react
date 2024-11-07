import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Dialog,
  DialogHeader,
  DialogContent,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { generateRandomString } from "@/services/generateRandomString";
import {
  arraySort,
  FilteredItemInPurchaseRequest,
} from "@/services/itemServices";
import {
  useAddRequestForQoutation,
} from "@/services/requestForQoutationServices";
import {
  requestForQoutationSchema,
  requestForQoutationType,
} from "@/types/request/request_for_qoutation";
import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";
import { FieldErrors, useFieldArray, useForm } from "react-hook-form";
import { useParams } from "react-router-dom";
import Loading from "../../shared/components/Loading";

interface TwoStepRFQFormProps {
  isDialogOpen: boolean;
  setIsDialogOpen: (open: boolean) => void;
}

export const TwoStepRFQForm: React.FC<TwoStepRFQFormProps> = ({
  isDialogOpen,
  setIsDialogOpen,
}) => {
  const { pr_no } = useParams();
  const items = FilteredItemInPurchaseRequest(pr_no!);
  // const {data, isLoading} = useGetItemInPurchaseRequest(pr_no!)
  // const items: ItemType = Array.isArray(data?.data) ? data.data : []

  // const sortedItems = arraySort(items!, "stock_property_no");
  // const items = Array.isArray(data?.data) ? data.data : []
  console.log(items)
  const sortedItems = arraySort(items!, "stock_property_no");
  const { mutate, isPending } = useAddRequestForQoutation();
  const rfq_no = `${pr_no}(${generateRandomString()})`;
  // const { data } = useRequestForQoutation();
  const [rfqCount, setRFQCount] = useState<number>(1);

  const {
    control,
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm({
    resolver: zodResolver(requestForQoutationSchema),
    defaultValues: {
      rfq_no: rfq_no,
      rfq_count: rfqCount.toString(),
      purchase_request: pr_no,
      supplier_name: "",
      supplier_address: "",
      tin: "",
      items: sortedItems?.map((item) => ({
        item: item.item_no,
        unit_price: "",
        brand_model: "",
      })),
    },
  });
  

  const { fields } = useFieldArray({ control, name: "items" });

  type RequestForQuotationField =
    | "purchase_request"
    | "items"
    | "rfq_no"
    | "supplier_name"
    | "supplier_address"
    | "tin"
    | `items.${number}.unit_price`
    | `items.${number}.brand_model`;

  interface RenderFieldProps {
    label: string;
    field_name: RequestForQuotationField;
    errors: FieldErrors<requestForQoutationType>;
  }

  const renderField = ({ label, field_name, errors }: RenderFieldProps) => (
    <div className="w-full">
      <Label>{label}</Label>
      <Input {...register(field_name)} />
      {errors && errors[field_name as keyof typeof errors] && (
        <span className="text-xs text-red-500">
          {errors[field_name as keyof typeof errors]?.message}
        </span>
      )}
    </div>
  );


  const onSubmit = async (data: requestForQoutationType) => {
    setRFQCount((prevCount) => prevCount + 1);
    try {
      const result = requestForQoutationSchema.safeParse(data);

      const itemRequests = data.items.map((item) => {
        const itemData = {
          rfq_no: rfq_no,
          rfq_count: rfqCount.toString(),
          purchase_request: data.purchase_request,
          supplier_name: data.supplier_name,
          supplier_address: data.supplier_address,
          tin: data.tin,
          item: item.item,
          unit_price: item.unit_price,
          brand_model: item.brand_model,
        };
        return result.success && !isPending && mutate(itemData);
      });

      // Wait for all items to be saved
      await Promise.all(itemRequests);
      setIsDialogOpen(false);
      reset();
    } catch (error) {
      console.error("Error saving items:", error);
    }
  };

  console.log(errors);
  console.log(fields)
  console.log(sortedItems)

  return (
    <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
      <DialogContent className="max-w-full w-[70rem]">
        <ScrollArea className="h-[32rem] mb-8">
          <DialogHeader>
            <DialogTitle>Create Request of Qoutation</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleSubmit(onSubmit)}>
            <Tabs defaultValue="supplier">
              <div className="w-full flex flex-col items-center">
                <TabsList className="grid grid-cols-2 w-1/2 items-center">
                  <TabsTrigger className="" value="supplier">
                    Supplier
                  </TabsTrigger>
                  <TabsTrigger value="items">Items</TabsTrigger>
                </TabsList>
              </div>
              <TabsContent value="supplier" className="">
                <Card>
                  <CardHeader>
                    <CardTitle>Supplier</CardTitle>
                    <CardDescription>
                      Please fill up the supplier information
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-2">
                    <div className="grid gap-4">
                      {renderField({
                        label: "Supplier Name",
                        field_name: "supplier_name",
                        errors,
                      })}
                      {renderField({
                        label: "Supplier Address",
                        field_name: "supplier_address",
                        errors,
                      })}
                    </div>
                    <div className="grid grid-cols-2 gap-4 items-end w-full">
                      {renderField({ label: "TIN", field_name: "tin", errors })}
                      <RadioGroup
                        className="flex items-center mb-3"
                        defaultValue="option-one"
                      >
                        <div className="flex items-center space-x-2">
                          <RadioGroupItem value="option-one" id="option-one" />
                          <Label htmlFor="option-one">Non VAT</Label>
                        </div>
                        <div className="flex items-center space-x-2">
                          <RadioGroupItem value="option-two" id="option-two" />
                          <Label htmlFor="option-two">VAT</Label>
                        </div>
                      </RadioGroup>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
              <TabsContent value="items">
                <Card>
                  <CardHeader>
                    <CardTitle>Items</CardTitle>
                    <CardDescription>
                      Please Fill up the Items Quotation
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-2">
                    <div className="grid grid-cols-8 gap-2 items-center p-2  border-b-2 sticky bg-background top-0">
                      <Label>Stock Property No</Label>
                      <Label>Unit</Label>
                      <Label>Item Description</Label>
                      <Label>Quantity</Label>
                      <Label>Unit Cost</Label>
                      <Label>Total Cost</Label>
                      <Label>Brand / Model</Label>
                      <Label>Unit Price </Label>
                    </div>
                    {sortedItems.length > 0 ? (
                      fields.map(
                        (field, index) =>
                          sortedItems && (
                            <div
                              key={field.id}
                              className="grid grid-cols-8 gap-2 mb-4 items-center p-2 border-b-2"
                            >
                              <Label className="text-gray-500">
                                {sortedItems[index]?.stock_property_no}
                              </Label>
                              <Label className="text-gray-500">
                                {sortedItems[index]?.unit}
                              </Label>
                              <Label className="text-gray-500">
                                {sortedItems[index]?.item_description}
                              </Label>
                              <Label className="text-gray-500">
                                {sortedItems[index]?.quantity}
                              </Label>
                              <Label className="text-gray-500">
                                {sortedItems[index]?.unit_cost}
                              </Label>
                              <Label className="text-gray-500">
                                {sortedItems[index]?.total_cost}
                              </Label>
                              <div className="flex flex-col">
                                <Input
                                  {...register(`items.${index}.brand_model`)}
                                />
                                {errors.items?.[index]?.brand_model && (
                                  <span className="text-xs text-red-500">
                                    {errors.items[index].brand_model?.message}
                                  </span>
                                )}
                              </div>
                              <div className="flex flex-col">
                                <Input
                                  {...register(`items.${index}.unit_price`)}
                                />
                                {errors.items?.[index]?.unit_price && (
                                  <span className="text-xs text-red-500">
                                    {errors.items[index].unit_price?.message}
                                  </span>
                                )}
                              </div>
                            </div>
                          )
                      )
                    ) : <Loading/>}

                    <div className="mt-6 fixed bottom-6 right-10">
                      <Button
                        className="text-slate-950 bg-orange-200 hover:bg-orange-300"
                        type="submit"
                      >
                        Submit Quotattion
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </form>
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
};
