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
import { ScrollArea } from "@/components/ui/scroll-area";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  useGetItemQuotation,
  useRequestForQoutation,
} from "@/services/requestForQoutationServices";
import { qoutationType } from "@/types/request/request_for_qoutation";
import { useEffect, useMemo, useState } from "react";
import { Loader2 } from "lucide-react";
import { SupplierCard } from "./SupplierCard";
import { Checkbox } from "@/components/ui/checkbox";
import {
  CheckCircledIcon,
  CrossCircledIcon,
  QuestionMarkCircledIcon,
} from "@radix-ui/react-icons";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import Loading from "../../shared/components/Loading";
import {
  abstractOfQuotationSchema,
  abstractOfQuotationType,
  itemSelectedQuoteType,
} from "@/types/request/abstract_of_quotation";
import { zodResolver } from "@hookform/resolvers/zod";
import { useFieldArray, useForm } from "react-hook-form";
import {
  useAbstractOfQuotation,
  useAddAbstractOfQuotation,
  useAddItemSelectedQuote,
  useAllItemSelectedQuote,
} from "@/services/AbstractOfQuotationServices";
import { useParams } from "react-router-dom";
import { v4 as uuidv4 } from "uuid";
import { Empty } from "../../shared/components/Empty";
import { useToast } from "@/hooks/use-toast";
import { generateAOQNo } from "@/services/generateAOQNo";

interface AbstractFormProps {
  isDialogOpen: boolean;
  setIsDialogOpen: (open: boolean) => void;
}

export const AbstractForm: React.FC<AbstractFormProps> = ({
  isDialogOpen,
  setIsDialogOpen,
}) => {
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [rfqNo, setRfqNo] = useState<string | null>(null);
  const [selectedSupplier, setSelectedSupplier] = useState<string | null>(null);
  const [itemSelected, setItemSelected] = useState<itemSelectedQuoteType[]>([]);

  const { pr_no } = useParams();
  const { toast } = useToast();

  const { data } = useRequestForQoutation();
  const { data: items_, isLoading: item_loading } = useGetItemQuotation();
  const { data: item_quote} =
    useAllItemSelectedQuote();
  const { data: abstract} =
    useAbstractOfQuotation();
  const abstract_data = Array.isArray(abstract?.data) ? abstract.data : [];
  const aoq_no = generateAOQNo(abstract_data, pr_no!);

  //get all selected item
  const item_selected_quote_no = useMemo(() => {
    const item_quote_data = Array.isArray(item_quote?.data)
      ? item_quote.data
      : [];
    const item_quote_no = item_quote_data
      ?.filter(
        (data) => data.is_item_selected && data.pr_details.pr_no === pr_no
      )
      .map((data) => data.item_details.item_details.item_no);
    return Array.from(new Set(item_quote_no));
  }, [item_quote, pr_no]);

  //get the item quotation in specific request for quotation
  const itemQuotation = useMemo(() => {
    const _items = Array.isArray(items_?.data) ? items_.data : [];
    return _items.filter((data) => data.rfq === rfqNo);
  }, [items_?.data, rfqNo]);

  //filter the item which is not yet selected
  const filteredItemQuotation = useMemo(() => {
    return itemQuotation.filter(
      (quotations) =>
        !item_selected_quote_no.includes(quotations.item_details.item_no)
    );
  }, [itemQuotation, item_selected_quote_no]);


  const quotations = useMemo(() => {
    const data_ = Array.isArray(data?.data) ? data.data : [];
    return data_.filter((data) => data.purchase_request === pr_no);
  }, [data?.data, pr_no]);


  const { mutate: addAOQMutation, isPending: aoqPending } =
    useAddAbstractOfQuotation();
  const { mutate: addItemSelectedMutation, isPending: itemSelectedPending } =
    useAddItemSelectedQuote();
  console.log(aoqPending);

  const { control, handleSubmit, reset, setValue, watch } = useForm({
    resolver: zodResolver(abstractOfQuotationSchema),
    defaultValues: {
      afq_no: uuidv4(),
      rfq: rfqNo,
      purchase_request: pr_no,
      items: itemQuotation?.map((item) => ({
        item_quote_no: uuidv4(),
        afq: rfqNo,
        purchase_request: pr_no,
        rfq: rfqNo,
        item_q: item.item_quotation_no,
        is_item_selected: false,
        total_amount: "",
      })),
    },
  });

  const itemsWatch = watch("items");

  useEffect(() => {
    if(!isDialogOpen){
      setItemSelected([])
    }
  }, [isDialogOpen])

  useEffect(() => {
    if (isDialogOpen && itemQuotation.length > 0) {
      setValue("afq_no", aoq_no);
      setValue("rfq", rfqNo!);
      setValue("purchase_request", pr_no);

      itemQuotation?.forEach((item, index) => {
        setValue(`items.${index}.item_quote_no`, uuidv4());
        setValue(`items.${index}.afq`, aoq_no);
        setValue(`items.${index}.purchase_request`, pr_no);
        setValue(`items.${index}.rfq`, rfqNo!);
        setValue(`items.${index}.item_q`, item.item_quotation_no);
        setValue(`items.${index}.is_item_selected`, false);
        setValue(
          `items.${index}.total_amount`,
          (
            Number(item.unit_price) * Number(item.item_details.quantity)
          ).toString()
        );
      });

    }
  }, [isDialogOpen, setValue, rfqNo, itemQuotation, pr_no, aoq_no]);

  const handleCheckboxChange = (index: number) => {
    const currentValue = itemsWatch[index]?.is_item_selected;

    const updatedValue = !currentValue;
    setValue(`items.${index}.is_item_selected`, updatedValue, {
      shouldValidate: true,
      shouldDirty: true,
      shouldTouch: true,
    });updatedItem

    const updatedItem = itemsWatch[index];
    setItemSelected((prevSelected: itemSelectedQuoteType[]) => {
      if (updatedValue) {
        return [...prevSelected, updatedItem as itemSelectedQuoteType];
      } else {
        return prevSelected.filter(
          (item: itemSelectedQuoteType) => item.item_q !== updatedItem.item_q
        );
      }
    });
  };

  const handleToggle = (supplier: qoutationType) => {
    setSelectedSupplier(
      supplier.supplier_name === selectedSupplier
        ? null
        : supplier.supplier_name
    );
    setRfqNo(supplier.rfq_no);
  };

  const { fields } = useFieldArray({ control, name: "items" });

  const onSubmit = async (data: abstractOfQuotationType) => {
    setIsLoading(true);
    try {
      let isSuccess: boolean;
      const result = abstractOfQuotationSchema.safeParse(data);
      if (!result.success) {
        console.error("Validation failed:", result.error);
        return;
      }

      const abstractData = {
        afq_no: data.afq_no,
        rfq: data.rfq,
        purchase_request: data.purchase_request,
      };

      await addAOQMutation(abstractData, {
        onSuccess: async (afqResponse) => {
          const afqNo = afqResponse.data?.afq_no;

          // Map over the items and perform addItemMutation with rfqNo from the response
          const itemSelectedDataArray = itemSelected.map((item) => {
            return {
              item_quote_no: item.item_quote_no,
              afq: afqNo!,
              purchase_request: item.purchase_request,
              rfq: item.rfq,
              item_q: item.item_q,
              is_item_selected: item.is_item_selected,
              total_amount: item.total_amount,
            };
          });

          // Perform all addItemMutation calls in parallel, but only once for each item
          await Promise.all(
            itemSelectedDataArray.map((itemData) => {
              console.log(itemData);
              addItemSelectedMutation(itemData);
              isSuccess = true;
            })
          );
          if (!aoqPending || !itemSelectedPending) {
            setIsLoading(false);
            setIsDialogOpen(false);
          }

          if (isSuccess) {
            toast({
              title: "Success",
              description: "Abstract of Quotation successfully added",
            });
          }

          reset({
            afq_no: "",
            rfq: "",
            purchase_request: "",
            items: [],
          });
        },
        onError: (error) => {
          toast({
            title: "Error",
            description:
              "Failed to save Abstract of Quotation. Please try again.",
            variant: "destructive",
          });
          console.error("Error saving RFQ:", error);
        },
      });
    } catch (error) {
      console.error("Error saving items:", error);
    }
  };

  const overallLoading =
    isLoading || item_loading || aoqPending || itemSelectedPending;
  if (overallLoading) return <Loading />;

  return (
    <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
      <DialogContent className="max-w-full w-[70rem] ">
        <DialogHeader>
          <DialogTitle className="text-2xl">
            Create Abstract of Quotation
          </DialogTitle>
        </DialogHeader>
        <ScrollArea className="h-[30rem] mb-9">
          <form onSubmit={handleSubmit(onSubmit)}>
            <Tabs defaultValue="supplier">
              <div className="w-full flex flex-col items-center sticky top-0 pb-4 bg-white">
                <TabsList className="grid grid-cols-2 w-1/2 items-center">
                  <TabsTrigger className="" value="supplier">
                    <span className="bg-orange-300  w-8 h-8 p-2 rounded-full mx-2">
                      1
                    </span>
                    <p className="text-base">Select Supplier</p>
                  </TabsTrigger>
                  <TabsTrigger value="items">
                    <span className="bg-orange-300  w-8 h-8 p-2 rounded-full mx-2">
                      2
                    </span>
                    <p className="text-base">Choose Items</p>
                  </TabsTrigger>
                </TabsList>
              </div>
              <TabsContent value="supplier" className=" ">
                <Card>
                  <CardHeader>
                    <CardTitle className="text-xl">
                      <p>Supplier</p>
                    </CardTitle>
                    <CardDescription>
                      <p>Please fill up the supplier information</p>
                      <p>Selected Supplier: {selectedSupplier}</p>
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="grid grid-cols-3 gap-2 relative">
                    {quotations.length > 0 ? (
                      quotations?.map((supplier) => (
                        <SupplierCard
                          supplier={supplier}
                          isSelected={
                            supplier.supplier_name === selectedSupplier
                          }
                          onToggle={() => handleToggle(supplier)}
                        />
                      ))
                    ) : (
                      <Empty message="No Supplier Found" />
                    )}
                  </CardContent>
                </Card>
              </TabsContent>
              <TabsContent value="items">
                <Card>
                  <CardHeader>
                    <CardTitle>
                      <div className="flex justify-between">
                        <p>Items</p>

                        <TooltipProvider>
                          <Tooltip>
                            <TooltipTrigger asChild>
                              <QuestionMarkCircledIcon
                                width={25}
                                height={25}
                                className="text-gray-600"
                              />
                            </TooltipTrigger>
                            <TooltipContent side="top">
                              <p>
                                Tick the checkbox to include this item in your
                                abstract of quotation.
                              </p>
                            </TooltipContent>
                          </Tooltip>
                        </TooltipProvider>
                      </div>
                    </CardTitle>
                    <CardDescription>
                      Please Fill up the Items Quotation
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-2">
                    <div className="grid grid-cols-9 gap-2 items-center py-4  border-b-2 sticky bg-background top-0">
                      <p>UNIT</p>
                      <p className="col-span-2">ITEM DESCRIPTION</p>
                      <p>QUANTITY</p>
                      <p>UNIT COST</p>
                      <p className="col-span-2">BRAND / MODEL</p>
                      <p>UNIT PRICE </p>
                      <p>SELECT ITEM</p>
                    </div>
                    {filteredItemQuotation &&
                    filteredItemQuotation?.length > 0 ? (
                      filteredItemQuotation.map(
                        (item, index) =>
                          fields && (
                            <div
                              key={item.item_quotation_no}
                              className="grid grid-cols-9 gap-2 mb-8 items-center py-4 border-b-2"
                            >
                              <p className="text-gray-500">
                                {filteredItemQuotation[index].item_details.unit}
                              </p>
                              <p className="text-gray-500 col-span-2">
                                {
                                  filteredItemQuotation[index].item_details
                                    .item_description
                                }
                              </p>
                              <p className="text-gray-500">
                                {
                                  filteredItemQuotation[index].item_details
                                    .quantity
                                }
                              </p>
                              <p className="text-gray-500">
                                {
                                  filteredItemQuotation[index].item_details
                                    .unit_cost
                                }
                              </p>
                              <div className="flex flex-col col-span-2">
                                <p className="text-gray-500">
                                  {filteredItemQuotation[index].brand_model}
                                </p>
                              </div>
                              <div className="flex flex-col">
                                <div
                                  className={`${
                                    item.is_low_price
                                      ? "text-green-400 bg-green-100"
                                      : "text-red-400 bg-red-100"
                                  } rounded-md flex gap-2 items-center`}
                                >
                                  <div className="pl-2">
                                    {item.is_low_price ? (
                                      <CheckCircledIcon />
                                    ) : (
                                      <CrossCircledIcon />
                                    )}
                                  </div>
                                  <p>
                                    {filteredItemQuotation[index].unit_price}
                                  </p>
                                </div>
                              </div>
                              <Checkbox
                                checked={itemsWatch[index]?.is_item_selected} // Controlled checked state
                                onCheckedChange={() => {
                                  handleCheckboxChange(index);
                                }}
                              />
                            </div>
                          )
                      )
                    ) : (
                      <div className="grid place-items-center w-full h-96">
                        <p className="flex">
                          No suppliers found. Please add a supplier to proceed.
                        </p>
                      </div>
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
                          <p className="text-base">Submit Quotation</p>
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
