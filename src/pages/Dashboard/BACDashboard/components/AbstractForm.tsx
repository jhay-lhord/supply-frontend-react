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
import {
  abstractType,
  abstractSchema,
} from "@/types/request/abstract_of_quotation";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import {
  useAbstractOfQuotation,
  useAddAbstractOfQuotation,
  useAddItemSelectedQuote,
  useAllItemSelectedQuote,
} from "@/services/AbstractOfQuotationServices";
import { useParams } from "react-router-dom";
import { v4 as uuidv4 } from "uuid";
import { Empty } from "../../shared/components/Empty";
import { generateAOQNo } from "@/services/generateAOQNo";
import Loading from "../../shared/components/Loading";

interface AbstractFormProps {
  prNoFromProps: string;
  isDialogOpen: boolean;
  setIsDialogOpen: (open: boolean) => void;
}

export const AbstractForm: React.FC<AbstractFormProps> = ({
  prNoFromProps,
  isDialogOpen,
  setIsDialogOpen,
}) => {
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [rfqNo, setRfqNo] = useState<string | null>(null);
  const [aoqNo, setAoqNo] = useState<string>("");
  const [selectedSupplier, setSelectedSupplier] = useState<string | null>(null);
  const [itemSelected, setItemSelected] = useState<string[]>([]);
  const [totalUnitPrice, setTotalUnitPrice] = useState<number>(0);

  const { pr_no } = useParams();

  //use the purchase request no from params if the purchase request number from props is undefined
  const purchaseNumber = prNoFromProps ? prNoFromProps : pr_no;

  const { data: rfqs } = useRequestForQoutation();
  const { data: items_, isLoading: item_loading } = useGetItemQuotation();

  const itemQuotation = useMemo(() => {
    const _items = Array.isArray(items_?.data) ? items_.data : [];
    return _items.filter((data) => data.rfq === rfqNo);
  }, [items_?.data, rfqNo]);

  const { data: item_quote } = useAllItemSelectedQuote();
  const { data: abstract } = useAbstractOfQuotation();

  const item_selected_quote_no = useMemo(() => {
    const item_quote_data = Array.isArray(item_quote?.data)
      ? item_quote.data
      : [];

    const item_quote_no = item_quote_data
      ?.filter(
        (data) =>
          data.is_item_selected && data.pr_details.pr_no === purchaseNumber
      )
      .map((data) => data.item_qoutation_details.item_details.item_no);
    return Array.from(new Set(item_quote_no));
  }, [item_quote, purchaseNumber]);

  const filteredItemQuotation = useMemo(() => {
    return itemQuotation.filter(
      (quotations) =>
        !item_selected_quote_no.includes(quotations.item_details.item_no)
    );
  }, [itemQuotation, item_selected_quote_no]);

  const quotations = useMemo(() => {
    const data_ = Array.isArray(rfqs?.data) ? rfqs.data : [];
    return data_.filter((data) => data.purchase_request === purchaseNumber);
  }, [rfqs?.data, purchaseNumber]);

  const { mutate: addAOQMutation } = useAddAbstractOfQuotation();
  const { mutate: addItemSelectedMutation, isPending } =
    useAddItemSelectedQuote();

  const { control, handleSubmit, setValue } = useForm({
    resolver: zodResolver(abstractSchema),
    defaultValues: {
      aoq_no: aoqNo,
      rfq: rfqNo,
      purchase_request: pr_no,
      item_quotation: "",
    },
  });

  useEffect(() => {
    if (!isDialogOpen) {
      setItemSelected([]);
      setTotalUnitPrice(0);
    }
  }, [isDialogOpen]);

  useEffect(() => {
    const abstract_data = Array.isArray(abstract?.data) ? abstract.data : [];
    setAoqNo(generateAOQNo(abstract_data, purchaseNumber!));
  }, [purchaseNumber, abstract?.data, isDialogOpen]);

  useEffect(() => {
    if (isDialogOpen && itemQuotation.length > 0) {
      itemQuotation.map((item) => {
        setValue("aoq_no", aoqNo);
        setValue("rfq", rfqNo!);
        setValue("purchase_request", purchaseNumber);
        setValue("item_quotation", item.item_quotation_no);
      });
    }
  }, [isDialogOpen, setValue, rfqNo, itemQuotation, purchaseNumber, aoqNo]);

  const handleToggle = (supplier: qoutationType) => {
    setSelectedSupplier(
      supplier.supplier_name === selectedSupplier
        ? null
        : supplier.supplier_name
    );
    setRfqNo((prevRfqNo) =>
      supplier.rfq_no === prevRfqNo ? null : supplier.rfq_no
    );
  };

  // const { fields } = useFieldArray({ control, name: "item_quotation" });

  const onSubmit = async (data: abstractType) => {
    setIsLoading(true);
    try {
      console.log(isLoading);
      console.log(isPending);
      const result = abstractSchema.safeParse(data);
      if (!result.success) {
        return;
      }

      await addAOQMutation(data, {
        onSuccess: async (afqResponse) => {
          const aoqNo = afqResponse?.data?.aoq_no;
          const itemSelectedDataArray = itemSelected.map((item) => {
            return {
              item_selected_no: uuidv4(),
              aoq: aoqNo!,
              purchase_request: purchaseNumber!,
              rfq: rfqNo!,
              item_qoutation: item,
              is_item_selected: true,
              total_amount: totalUnitPrice.toString(),
            };
          });

          await Promise.all(
            itemSelectedDataArray.map((itemData) => {
              addItemSelectedMutation(itemData);
            })
          );

          setIsLoading(false);
          setIsDialogOpen(false);
        },
      });
    } catch (error) {
      console.error("Error saving items:", error);
    }
  };

  const handleCheckBoxChange = (
    item_quotation_no: string,
    isChecked: boolean,
    unitPrice: number
  ) => {
    setItemSelected((prevItemSelected) => {
      if (isChecked) {
        return [...prevItemSelected, item_quotation_no];
      } else {
        return prevItemSelected.filter((item) => item !== item_quotation_no);
      }
    });
    setTotalUnitPrice((prevTotal) => {
      if (isChecked) {
        return prevTotal + unitPrice;
      } else {
        return prevTotal - unitPrice;
      }
    });
  };

  return (
    <>
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
                <div className="w-full flex flex-col items-center sticky top-0 z-10 pb-4 bg-white">
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
                    <div className="fixed bottom-6 right-10">
                      <TabsList className="bg-orange-200">
                        <TabsTrigger
                          className="bg-orange-200 px-6 py-1 text-gray-950"
                          value="items"
                        >
                          Next
                        </TabsTrigger>
                      </TabsList>
                    </div>
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
                      {item_loading ? (
                        <Loading />
                      ) : filteredItemQuotation &&
                        filteredItemQuotation?.length > 0 ? (
                        filteredItemQuotation.map(
                          (item, index) =>
                              <div
                                key={item.item_quotation_no}
                                className="grid grid-cols-9 gap-2 mb-8 items-center py-4 border-b-2"
                              >
                                <p className="text-gray-500">
                                  {
                                    filteredItemQuotation[index].item_details
                                      .unit
                                  }
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
                                  checked={itemSelected.includes(
                                    item.item_quotation_no
                                  )} // Set the controlled state
                                  onCheckedChange={(isChecked) => {
                                    handleCheckBoxChange(
                                      item.item_quotation_no,
                                      isChecked as boolean,
                                      Number(item.unit_price)
                                    );
                                  }}
                                />
                              </div>
                        )
                      ) : (
                        <div className="grid place-items-center w-full h-96">
                          <p className="flex">
                            No suppliers found. Please select a supplier to
                            proceed.
                          </p>
                        </div>
                      )}
                      <div className="fixed bottom-6 right-10">
                        <Button
                          className={`text-slate-950 bg-orange-200 px-8 py-1 hover:bg-orange-300 ${
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
                    <div className="fixed bottom-6 left-10">
                      <TabsList className="border-2 border-orange-200">
                        <TabsTrigger
                          className="px-8 py-1 text-gray-950"
                          value="supplier"
                        >
                          Back
                        </TabsTrigger>
                      </TabsList>
                    </div>
                  </Card>
                </TabsContent>
              </Tabs>
            </form>
          </ScrollArea>
        </DialogContent>
      </Dialog>
    </>
  );
};
