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
  useAddItemQuotation,
  useAddRequestForQoutation,
} from "@/services/requestForQoutationServices";
import {
  requestForQoutationSchema,
  requestForQoutationType,
} from "@/types/request/request_for_qoutation";
import { zodResolver } from "@hookform/resolvers/zod";
import { FieldErrors, useFieldArray, useForm } from "react-hook-form";
import { useParams } from "react-router-dom";
import Loading from "../../shared/components/Loading";
import { useState } from "react";
import { Loader2 } from "lucide-react";
import { Textarea } from "@/components/ui/textarea";

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
  const sortedItems = arraySort(items!, "stock_property_no");
  const rfq_no = pr_no; //set the initial value rfq_no to pr_no and later in submit handler it have a random Letter
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const { mutate: addRFQMutation } = useAddRequestForQoutation();
  const { mutate: addItemMutation } = useAddItemQuotation();

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
      purchase_request: pr_no,
      supplier_name: "",
      supplier_address: "",
      tin: "",
      is_VAT: true,
      items: sortedItems?.map((item) => ({
        purchase_request: pr_no,
        rfq: rfq_no,
        item: item.item_no,
        unit_price: 0,
        brand_model: "",
        is_low_price: false,
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
    setIsLoading(true);
    try {
      const result = requestForQoutationSchema.safeParse(data);
      if (!result.success) {
        console.error("Validation failed:", result.error);
        return;
      }

      const quotationData = {
        rfq_no: `${rfq_no}(${generateRandomString()})`,
        purchase_request: data.purchase_request ?? "",
        supplier_name: data.supplier_name ?? "",
        supplier_address: data.supplier_address ?? "",
        tin: data.tin ?? "",
        is_VAT: data.is_VAT ?? "",
      };

      addRFQMutation(quotationData, {
        onSuccess: async (rfqResponse) => {
          const rfqNo = rfqResponse.data?.rfq_no;

          // Map over the items and perform addItemMutation with rfqNo from the response
          const itemDataArray = data.items.map((item) => {
            const sortedItem = sortedItems.find(
              (sorted) => sorted.item_no === item.item 
            );

            return {
              purchase_request: pr_no ?? "",
              rfq: rfqNo ?? "",
              item: item.item ?? "",
              unit_price: item.unit_price ?? 0,
              brand_model: item.brand_model ?? "",
              is_low_price: sortedItem
                ? Number(item.unit_price) < Number(sortedItem.unit_cost)
                : false,
            };
          });

          // Perform all addItemMutation calls in parallel, but only once for each item
          await Promise.all(
            itemDataArray.map((itemData) => addItemMutation(itemData))
          );

          setIsLoading(false);
          setIsDialogOpen(false);
          reset();
        },
        onError: (error) => {
          console.error("Error saving RFQ:", error);
        },
      });
    } catch (error) {
      console.error("Error saving items:", error);
    }
  };

  return (
    <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
      <DialogContent className="max-w-full w-[70rem]">
          <DialogHeader>
            <DialogTitle className="text-2xl">
              Create Request of Qoutation
            </DialogTitle>
          </DialogHeader>
        <ScrollArea className="h-[30rem] mb-9">
          <form onSubmit={handleSubmit(onSubmit)}>
            <Tabs defaultValue="supplier">
              <div className="w-full flex flex-col items-center">
                <TabsList className="grid grid-cols-2 w-1/2 items-center">
                  <TabsTrigger className="" value="supplier">
                    <span className="bg-gray-400  w-8 h-8 p-2 rounded-full mx-2">1</span> Supplier
                  </TabsTrigger>
                  <TabsTrigger value="items"><span className="bg-gray-400  w-8 h-8 p-2 rounded-full mx-2">2</span>Items</TabsTrigger>
                </TabsList>
              </div>
              <TabsContent value="supplier" className="">
                <Card>
                  <CardHeader>
                    <CardTitle className="text-xl">Supplier</CardTitle>
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
                    <div className="grid grid-cols-7 gap-2 items-center p-2  border-b-2 sticky bg-background top-0">
                      {/* <Label>Stock Property No</Label> */}
                      <Label>Unit</Label>
                      <Label>Item Description</Label>
                      <Label>Quantity</Label>
                      <Label>Unit Cost</Label>
                      {/* <Label>Total Cost</Label> */}
                      <Label className="col-span-2">Brand / Model</Label>
                      <Label>Unit Price </Label>
                    </div>
                    {sortedItems.length > 0 ? (
                      fields.map(
                        (field, index) =>
                          sortedItems && (
                            <div
                              key={field.id}
                              className="grid grid-cols-7 gap-2 mb-8 items-center p-2 border-b-2"
                            >
                              {/* <Label className="text-gray-500">
                                {sortedItems[index]?.stock_property_no}
                              </Label> */}
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
                              {/* <Label className="text-gray-500">
                                {sortedItems[index]?.total_cost}
                              </Label> */}
                              <div className="flex flex-col col-span-2">
                                <Textarea
                                  {...register(`items.${index}.brand_model`)}
                                  className=""
                                />
                                {errors.items?.[index]?.brand_model && (
                                  <span className="text-xs text-red-500">
                                    {errors.items[index].brand_model?.message}
                                  </span>
                                )}
                              </div>
                              <div className="flex flex-col">
                                <Input
                                  {...register(`items.${index}.unit_price`, {
                                    valueAsNumber: true,
                                  })}
                                  type="number"
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
                    ) : (
                      <Loading />
                    )}

                    <div className="fixed bottom-6 right-10">
                      <Button
                        className={`text-slate-950 bg-orange-200 px-8 hover:bg-orange-300 ${
                          isLoading && "px-16"
                        }`}
                        type="submit"
                      >
                        {isLoading ? (
                          <Loader2 className="animate-spin" />
                        ) : (
                          "Submit Quotation"
                        )}
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
