import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
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
  supplierType,
  supplierItemType,
} from "@/types/request/abstract_of_quotation";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import {
  addSupplier,
  useAddAbstractOfQuotation,
  useAddSupplierItem,
} from "@/services/AbstractOfQuotationServices";
import { useParams } from "react-router-dom";
import { v4 as uuidv4 } from "uuid";
import { Empty } from "../../shared/components/Empty";
import Loading from "../../shared/components/Loading";
import { itemQuotationResponseType } from "@/types/response/request-for-qoutation";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import { MessageDialog } from "../../shared/components/MessageDialog";
import { AxiosError } from "axios";
import { FilteredItemInPurchaseRequest } from "@/services/itemServices";
import { indexToLetter } from "@/utils/indexToLetter";
import { Input } from "@/components/ui/input";

interface AbstractFormProps {
  prNoFromProps: string;
  isDialogOpen: boolean;
  setIsDialogOpen: (open: boolean) => void;
}

interface SelectedItems {
  rfq_no: string;
  item_quote_no: string;
  item_no: string;
  item_quantity: number;
  item_cost: number;
  total_amount: number;
}

interface Quotation {
  rfq_no: string;
  items: SelectedItems[];
}

interface messageDialogProps {
  open: boolean;
  message: string;
  title: string;
  type: "success" | "error" | "info";
}

export const AbstractForm: React.FC<AbstractFormProps> = ({
  prNoFromProps,
  isDialogOpen,
  setIsDialogOpen,
}) => {
  const [messageDialog, setMessageDialog] = useState<messageDialogProps>({
    open: false,
    message: "",
    title: "",
    type: "success" as const,
  });
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [rfqNo, setRfqNo] = useState<string | null>(null);
  const [selectedSupplier, setSelectedSupplier] = useState<string | null>(null);
  const [quotations, setQuotations] = useState<Quotation[]>([]);
  const [editableQuotation, setEditableQuotation] = useState<
    itemQuotationResponseType[]
  >([]);

  const { pr_no } = useParams();

  //use the purchase request no from params if the purchase request number from props is undefined
  const purchaseNumber = prNoFromProps ? prNoFromProps : pr_no;

  const { data: rfqs } = useRequestForQoutation();
  const { data: items_, isLoading: item_loading } = useGetItemQuotation();
  const purchaseItems = FilteredItemInPurchaseRequest(purchaseNumber!);
  const _items = useMemo(() => {
    return Array.isArray(items_?.data) ? items_.data : [];
  }, [items_?.data])


  const itemQuotation = useMemo(() => {
    return _items.filter((data) => data.rfq === rfqNo);
  }, [_items, rfqNo]);

  const quotations_ = useMemo(() => {
    const data_ = Array.isArray(rfqs?.data) ? rfqs.data : [];
    return data_.filter((data) => data.purchase_request === purchaseNumber);
  }, [rfqs?.data, purchaseNumber]);

  const { mutate: addAOQMutation } = useAddAbstractOfQuotation();
  const { mutate: addSupplierItemMutation } = useAddSupplierItem();

  const { handleSubmit, setValue } = useForm({
    resolver: zodResolver(abstractSchema),
    defaultValues: {
      aoq_no: purchaseNumber ?? "",
      purchase_request: purchaseNumber ?? "",
    },
  });

  useEffect(() => {
    if (isDialogOpen && itemQuotation.length > 0) {
      setValue("aoq_no", purchaseNumber ?? "");
      setValue("purchase_request", purchaseNumber ?? "");
      setEditableQuotation(itemQuotation);
    }
  }, [isDialogOpen, setValue, itemQuotation, purchaseNumber]);

  useEffect(() => {
    
    if (isDialogOpen && itemQuotation && itemQuotation.length > 0) {
      setEditableQuotation(itemQuotation);
    } 
  }, [itemQuotation, isDialogOpen, selectedSupplier]);


  const handleItemSelection = (item: itemQuotationResponseType) => {
    if (!selectedSupplier) return;
    setQuotations((prevQuotations) => {
      const supplierQuotation = prevQuotations.find(
        (q) => q.rfq_no === selectedSupplier
      );
      const selectedItem: SelectedItems = {
        rfq_no: item.rfq,
        item_quote_no: item.item_quotation_no,
        item_no: item.item_details.item_no,
        item_quantity: Number(item.item_details.quantity),
        item_cost: Number(item.item_details.unit_cost),
        total_amount:
          Number(item.item_details.quantity) * Number(item.unit_price),
      };

      if (supplierQuotation) {
        const itemIndex = supplierQuotation.items.findIndex(
          (i) => i.item_quote_no === item.item_quotation_no
        );
        if (itemIndex > -1) {
          const updatedItems = [...supplierQuotation.items];
          updatedItems.splice(itemIndex, 1);
          return prevQuotations.map((q) =>
            q.rfq_no === selectedSupplier ? { ...q, items: updatedItems } : q
          );
        } else {
          return prevQuotations.map((q) =>
            q.rfq_no === selectedSupplier
              ? { ...q, items: [...q.items, selectedItem] }
              : q
          );
        }
      } else {
        return [
          ...prevQuotations,
          { rfq_no: selectedSupplier, items: [selectedItem] },
        ];
      }
    });
  };

  const isItemSelected = (item_no: string) => {
    return quotations.some(
      (quotation) =>
        quotation.rfq_no !== selectedSupplier &&
        quotation.items.some((item) => item.item_no === item_no)
    );
  };

  const isItemSelectedForCurrentSupplier = (item_quote_no: string) => {
    return (
      quotations
        .find((quotation) => quotation.rfq_no === selectedSupplier)
        ?.items.some((item) => item.item_quote_no === item_quote_no) || false
    );
  };

  const handleToggle = (supplier: qoutationType) => {
    setSelectedSupplier(
      supplier.rfq_no === selectedSupplier ? null : supplier.rfq_no
    );
    setRfqNo((prevRfqNo) =>
      supplier.rfq_no === prevRfqNo ? null : supplier.rfq_no
    );
  };

  const allItemQuotationCount = purchaseItems && purchaseItems?.length;

  const selectedItems = useMemo(() => {
    return new Set(
      quotations.flatMap((data) => data.items.map((item) => item.item_quote_no))
    );
  }, [quotations]);

  const restrictedSubmitAction = allItemQuotationCount! > selectedItems.size;

  const handleInputChange = (index: number, field: 'quantity' | 'unit_cost', value: string) => {
    const updatedQuotation = [...editableQuotation];
    updatedQuotation[index].item_details[field] = value ?? 0;
    setEditableQuotation(updatedQuotation);
  };


  const onSubmit = async (
    data: abstractType | supplierType | supplierItemType
  ) => {
    setIsLoading(true);
    try {
      const result = abstractSchema.safeParse(data);

      if (!result.success) {
        return;
      }

      await addAOQMutation(data as abstractType, {
        onSuccess: async (AOQResponse) => {
          const aoqNo = AOQResponse?.data?.aoq_no;

          const suppliersWithItems = quotations.map((quotation, index) => ({
            supplier_no: uuidv4(),
            extra_character: indexToLetter(index + 1),
            aoq: aoqNo!,
            rfq: quotation.rfq_no,
            items: quotation.items,
          }));

          let allItems: Array<supplierItemType> = [];

          for (const supplier of suppliersWithItems) {
            try {
              const supplierResponse = await addSupplier({
                supplier_no: supplier.supplier_no,
                extra_character: supplier.extra_character ?? "",
                aoq: supplier.aoq,
                rfq: supplier.rfq,
              });

              const supplier_no = supplierResponse?.data?.supplier_no;
              if (!supplier_no) {
                console.error(
                  "Failed to retrieve supplier number from the response."
                );
                continue;
              }

              const supplierItems = supplier.items.map((item) => ({
                supplier_item_no: uuidv4(),
                supplier: supplier_no,
                rfq: item.rfq_no,
                item_quotation: item.item_quote_no,
                item_quantity: item.item_quantity,
                item_cost: item.item_cost,
                total_amount: item.total_amount.toString(),
              }));


              allItems = [...allItems, ...supplierItems];
            } catch (error) {
              console.error("Error processing supplier:", error);
            }
          }

          await Promise.all(
            allItems.map(async (item) => {
              await addSupplierItemMutation(item);
            })
          );

          setIsDialogOpen(false);
          setIsLoading(false);
          setMessageDialog({
            open: true,
            message: "Abstract added successfully",
            title: "Success",
            type: "success",
          });
        },
        onError: () => {
          setIsDialogOpen(false);
          setIsLoading(false);
          setMessageDialog({
            open: true,
            message: "Something went wrong, please try again later",
            title: "Error",
            type: "error",
          });
        },
      });
    } catch (error) {
      setIsDialogOpen(false);
      setIsLoading(false);
      setMessageDialog({
        open: true,
        message:
          (error as AxiosError).message ??
          "Something went wrong, please try again later",
        title: "Error",
        type: "error",
      });
    }
  };

  return (
    <>
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="max-w-full w-[70rem] ">
          <DialogHeader>
            <DialogTitle className="text-2xl">
              Create Abstract of Quotation [{purchaseNumber}]
            </DialogTitle>
          </DialogHeader>
          <ScrollArea className="h-[30rem] mb-9">
            <form onSubmit={handleSubmit(onSubmit)}>
              <Card className="w-full">
                <CardHeader>
                  <CardTitle className="text-xl w-full">
                    <p className="">Select Supplier</p>
                    <Carousel
                      opts={{
                        align: "start",
                        loop: true,
                      }}
                      className=" mx-10"
                    >
                      <CarouselContent className="">
                        {quotations_.length > 0 ? (
                          quotations_?.map((supplier, index) => (
                            <CarouselItem
                              key={index}
                              className="md:basis-1/2 lg:basis-1/3"
                            >
                              <div className="p-1">
                                <SupplierCard
                                  supplier={supplier}
                                  isSelected={
                                    supplier.rfq_no === selectedSupplier
                                  }
                                  onToggle={() => handleToggle(supplier)}
                                />
                              </div>
                            </CarouselItem>
                          ))
                        ) : (
                          <Empty message="No Supplier Found" />
                        )}
                      </CarouselContent>
                      <CarouselPrevious />
                      <CarouselNext />
                    </Carousel>
                  </CardTitle>
                </CardHeader>
                <CardContent className="">
                  <div className="flex justify-between">
                    <p className="text-xl">Items</p>

                    <TooltipProvider delayDuration={100}>
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

                  <div>
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
                    ) : editableQuotation && editableQuotation?.length > 0 ? (
                      editableQuotation.map((item, index) => (
                        <div
                          key={item.item_quotation_no}
                          className="grid grid-cols-9 gap-2 items-center py-6 border-b-2"
                        >
                          <p className="text-gray-500">
                            {editableQuotation[index].item_details.unit}
                          </p>
                          <p className="text-gray-500 col-span-2">
                            {editableQuotation[index].item_details.item_description}
                          </p>
                          <Input
                            defaultValue={
                              editableQuotation[index].item_details.quantity
                            }
                            value={
                              editableQuotation[index].item_details.quantity
                            }
                            onChange={(e) =>
                              handleInputChange(
                                index,
                                "quantity",
                                e.target.value
                              )
                            }
                          />
                          <Input
                            defaultValue={
                              editableQuotation[index].item_details.unit_cost
                            }
                            value={
                              editableQuotation[index].item_details.unit_cost
                            }
                            onChange={(e) =>
                              handleInputChange(
                                index,
                                "unit_cost",
                                e.target.value
                              )
                            }
                          />
                          <div className="flex flex-col col-span-2">
                            <p className="text-gray-500">
                              {editableQuotation[index].brand_model}
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
                              <p>{itemQuotation[index].unit_price}</p>
                            </div>
                          </div>

                          <Checkbox
                            className="place-self-center"
                            checked={isItemSelectedForCurrentSupplier(
                              item.item_quotation_no.toString()
                            )}
                            onCheckedChange={() => handleItemSelection(item)}
                            disabled={
                              !selectedSupplier ||
                              isItemSelected(item.item_details.item_no)
                            }
                          />
                        </div>
                      ))
                    ) : (
                      <div className="grid place-items-center w-full h-96">
                        <p className="flex">
                          No suppliers found. Please select a supplier to
                          proceed.
                        </p>
                      </div>
                    )}
                  </div>
                </CardContent>
                <CardFooter>
                  <div className="fixed bottom-6 right-10 flex gap-2 items-center">
                    <p>
                      ({selectedItems.size} of {purchaseItems?.length} item
                      selected)
                    </p>
                    <Button
                      className={`text-slate-950 bg-orange-200 px-8 py-1 hover:bg-orange-300 ${
                        isLoading && "px-16"
                      }`}
                      type="submit"
                      disabled={restrictedSubmitAction}
                    >
                      {isLoading ? (
                        <Loader2 className="animate-spin" />
                      ) : (
                        <p className="text-base">Submit Quotation</p>
                      )}
                    </Button>
                  </div>
                </CardFooter>
              </Card>
            </form>
          </ScrollArea>
        </DialogContent>
      </Dialog>

      <MessageDialog
        open={messageDialog.open}
        message={messageDialog.message}
        title={messageDialog.title}
        type={messageDialog.type}
        onOpenChange={(open) => setMessageDialog((prev) => ({ ...prev, open }))}
      />
    </>
  );
};
