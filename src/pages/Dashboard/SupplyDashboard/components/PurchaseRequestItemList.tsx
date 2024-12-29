import { useParams } from "react-router-dom";
import {
  deleteItem,
  FilteredItemInPurchaseRequest,
  arraySort,
} from "@/services/itemServices";
import {
  usePurchaseRequestActions,
  usePurchaseRequestList,
} from "@/services/purchaseRequestServices";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  PurchaseRequestData,
  purchaseRequestFormSchema,
} from "@/types/request/purchase-request";
import {
  Tooltip,
  TooltipProvider,
  TooltipTrigger,
  TooltipContent,
} from "@/components/ui/tooltip";
import { TrashIcon, Pencil1Icon } from "@radix-ui/react-icons";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import PurchaseRequestForm from "./PurchaseRequestForm";
import { itemType } from "@/types/response/item";
import { useEffect } from "react";
import ItemForm from "./ItemForm";
import { toast } from "sonner";
import { DeleteDialog } from "./DeleteDialog";
import Loading from "../../shared/components/Loading";
import EditItemForm from "./EditItemForm";
import {
  ArrowLeftIcon,
  CalendarIcon,
  CheckCircleIcon,
  CircleMinusIcon,
  CircleXIcon,
  FileTextIcon,
  Loader2,
  MoveRightIcon,
  PencilLineIcon,
  TargetIcon,
  UserIcon,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { formatDate } from "@/services/formatDate";
import EditPRForm from "./EditPRForm";
import { generatePRPDF } from "@/services/generatePRPDF";
import useStatusStore from "@/store";
import { MessageDialog } from "../../shared/components/MessageDialog";
import { RESTRICTED_ACTION_STATUS } from "@/constants";

interface messageDialogProps {
  open: boolean;
  message: string;
  type: "success" | "error" | "info";
  title: string;
}

export default function PurchaseRequestItemList() {
  const [isDialogOpen, setIsDialogOpen] = useState<boolean>(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState<boolean>(false);
  const [messageDialog, setMessageDialog] = useState<messageDialogProps>({
    open: false,
    type: "success" as const,
    title: "",
    message: "",
  });

  const { pr_no } = useParams();
  const { setStatus, status } = useStatusStore();

  const items = FilteredItemInPurchaseRequest(pr_no!);
  const {
    isLoading,
    data: purchase_request,
    error,
  } = usePurchaseRequestList(pr_no!);

  const {
    handleApprove,
    handleReject,
    handleCancel,
    handleForward,
    isPendingApprove,
    isPendingReject,
    isPendingCancel,
    isPendingForward,
    isError,
    isSuccess,
  } = usePurchaseRequestActions();

  const purchaseData = purchase_request?.data;

  const navigate = useNavigate();

  const { setValue } = useForm<PurchaseRequestData>({
    resolver: zodResolver(purchaseRequestFormSchema),
    defaultValues: {
      pr_no: pr_no,
      purpose: purchaseData?.purpose,
      status: purchaseData?.status,
      office: purchaseData?.office,
      requisitioner: purchaseData?.requisitioner_details.name,
      campus_director: purchaseData?.campus_director_details.name,
    },
  });

  useEffect(() => {
    if (purchaseData) {
      setValue("purpose", purchaseData?.purpose || "");
      setValue("office", purchaseData?.office || "");
      setValue("requisitioner", purchaseData?.requisitioner_details.name || "");
      setValue(
        "campus_director",
        purchaseData?.campus_director_details.name || ""
      );
      setValue("status", purchaseData?.status);
    }
  }, [purchaseData, setValue]);

  useEffect(() => {
    setStatus(purchaseData?.status);

    return () => {
      setStatus("idle");
    };
  }, [setStatus, purchaseData]);

  const actionDisabled = RESTRICTED_ACTION_STATUS.includes(status!)

  let sortedItems;
  if (!isLoading) {
    sortedItems = arraySort(items!, "stock_property_no");
  }

  const handleOpenEditForm = () => setIsEditDialogOpen(true);

  const handleForwardToProcurement = async () => {
    await handleForward(pr_no!);
    if (isSuccess) {
      setMessageDialog({
        open: true,
        message: "Forwarded to Procurement Successfully ",
        title: "Success",
        type: "success",
      });
    }

    if (isError) {
      setMessageDialog({
        open: true,
        message: "Something went wrong, Please try again later",
        title: "Error",
        type: "error",
      });
    }
  };

  const handleGeneratePDF = async () => {
    const purchaseRequestData = purchase_request?.data;
    const itemsData = items ? items : [];

    const pdfURL = await generatePRPDF(purchaseRequestData!, itemsData);
    return itemsData.length != 0
      ? window.open(pdfURL!, "_blank")
      : navigate("/supply/not-found");
  };

  if (isLoading) return <Loading />;
  if (error) return <div>{error.message}</div>;

  return (
    <div className="">
      <Button className="mb-2" onClick={() => navigate(-1)}>
        <span className="flex gap-2 items-center">
          <ArrowLeftIcon className="h-5 w-5" />
          <p>Back</p>
        </span>
      </Button>

      <Card className="w-full bg-slate-100">
        <CardHeader className="flex flex-col">
          <CardTitle className="">
            <div>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div>
                    <p className="font-thin">{purchaseData?.pr_no}</p>
                    <div className="flex items-center pt-2">
                      <CalendarIcon className="w-3 h-3 mr-1" />
                      <p className="text-sm font-thin">
                        {purchaseData?.created_at &&
                          formatDate(purchaseData?.created_at)}
                      </p>
                    </div>
                  </div>
                  <Button
                    type="button"
                    disabled={actionDisabled}
                    className=" bg-orange-200 hover:bg-orange-300 text-slate-950"
                    onClick={handleOpenEditForm}
                  >
                    <PencilLineIcon className=" w-4 h-4 mr-2" /> Edit
                  </Button>
                </div>

                <Badge
                  className={
                    purchaseData?.status === "Approved"
                      ? "bg-green-200 hover:bg-green-300 text-green-500"
                      : purchaseData?.status === "Cancelled"
                      ? "bg-red-100 hover:bg-red-200 text-red-400"
                      : "bg-orange-100 text-orange-400"
                  }
                >
                  {purchaseData?.status}
                </Badge>
              </div>
              <Separator className="mt-3" />
              <div className="flex items-center gap-4 mt-2">
                <div className="flex items-center">
                  <UserIcon className="w-4 h-4 mr-1" />
                  <p className="text-lg font-thin">
                    {purchaseData?.requisitioner_details.name}
                  </p>
                </div>
                <Separator orientation="vertical" className="h-6" />
                <div className="flex items-center">
                  <TargetIcon className="w-4 h-4 mr-1" />
                  <p className="text-lg font-thin">{purchaseData?.purpose}</p>
                </div>
              </div>
            </div>
          </CardTitle>
          <div className="flex justify-between pt-4 pb-2">
            <TooltipProvider delayDuration={100} skipDelayDuration={200}>
              <Tooltip>
                <TooltipTrigger asChild>
                  <div>
                    <Button
                      disabled={items?.length === 0}
                      onClick={handleGeneratePDF}
                      className="flex bg-green-300 hover:rounded-full hover:bg-green-300 hover:border-none text-gray-950"
                    >
                      <p className="mx-1 text-sm font-thin">Generate PDF</p>
                      <FileTextIcon className="w-4 h-4 mr-2" />
                      <span className="sr-only">Generate PDF</span>
                    </Button>
                  </div>
                </TooltipTrigger>
                <TooltipContent side="top">
                  {items?.length === 0
                    ? "Please add Items to generate PDF"
                    : "Click to generate PDF"}
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
            <div className="flex gap-1">
              <>
                {purchaseData?.status !== "Cancelled" &&
                  purchaseData?.status !== "Forwarded to Procurement" &&
                  purchaseData?.status !== "Received by the Procurement" &&
                  purchaseData?.status !== "Ready to Order" && (
                    <>
                      {purchaseData?.status !== "Approved" &&
                        purchaseData?.status !== "Rejected" && (
                          <Button
                            className="bg-green-400 hover:bg-green-500 text-white"
                            onClick={() => handleApprove(pr_no!)}
                            disabled={isPendingApprove}
                          >
                            <CheckCircleIcon className="w-4 h-4 mr-2" />
                            {isPendingApprove ? (
                              <Loader2 className="animate-spin" />
                            ) : (
                              "Approve"
                            )}
                          </Button>
                        )}

                      {purchaseData?.status !== "Approved" &&
                        purchaseData?.status !== "Rejected" &&
                        purchaseData?.status !== "Cancelled" && (
                          <Button
                            className="bg-red-400 hover:bg-red-500 text-white"
                            onClick={() => handleReject(pr_no!)}
                            disabled={isPendingReject}
                          >
                            <CircleXIcon className="w-4 h-4 mr-2" />
                            {isPendingReject ? (
                              <Loader2 className="animate-spin" />
                            ) : (
                              "Reject"
                            )}
                          </Button>
                        )}

                      {purchaseData?.status !== "Rejected" && (
                        <Button
                          className="bg-orange-300 hover:bg-orange-400 text-white"
                          onClick={() => handleCancel(pr_no!)}
                          disabled={isPendingCancel}
                        >
                          <CircleMinusIcon className="w-4 h-4 mr-2" />
                          {isPendingCancel ? (
                            <Loader2 className="animate-spin" />
                          ) : (
                            "Cancel"
                          )}
                        </Button>
                      )}

                      {purchaseData?.status === "Approved" && (
                        <TooltipProvider delayDuration={100}>
                          <Tooltip>
                            <TooltipTrigger asChild>
                              <Button
                                onClick={handleForwardToProcurement}
                                variant="outline"
                                disabled={isPendingForward}
                                className="flex data-[state=open]:bg-muted hover:rounded-full bg- hover:bg-green-300 hover:border-none text-gray-950"
                              >
                                <p className="mx-1 text-sm font-thin">
                                  {isPendingForward ? (
                                    <Loader2 className="animate-spin" />
                                  ) : (
                                    "Forward"
                                  )}
                                </p>
                                <MoveRightIcon className="h-4 w-4" />
                                <span className="sr-only">Delete</span>
                              </Button>
                            </TooltipTrigger>
                            <TooltipContent side="top">
                              Forward to Procurement
                            </TooltipContent>
                          </Tooltip>
                        </TooltipProvider>
                      )}
                    </>
                  )}
              </>
            </div>
          </div>
          <Separator className="pt-0 text-orange-300 bg-orange-200" />
        </CardHeader>
        <CardContent>
          <ItemList sortedItems={sortedItems!} />
        </CardContent>
        <CardFooter className="flex justify-between"></CardFooter>
      </Card>

      <EditPRForm
        isEditDialogOpen={isEditDialogOpen}
        setIsEditDialogOpen={setIsEditDialogOpen}
        pr_no={purchaseData?.pr_no ?? ""}
      />

      <PurchaseRequestForm
        isDialogOpen={isDialogOpen}
        setIsDialogOpen={setIsDialogOpen}
        lastPrNo={pr_no}
      />

      <MessageDialog
        message={messageDialog?.message}
        title={messageDialog?.title}
        type={messageDialog?.type}
        open={messageDialog?.open}
        onOpenChange={(open) => setMessageDialog((prev) => ({ ...prev, open }))}
      />
    </div>
  );
}

const ItemList = ({ sortedItems }: { sortedItems: itemType[] }) => {
  const [isDialogOpen, setIsDialogOpen] = useState<boolean>(false);
  const [selectedItemNo, setSelectedItemNo] = useState<string | null>(null);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState<boolean>(false);

  const { pr_no } = useParams();
  const queryClient = useQueryClient();
  const { status } = useStatusStore();

  const deleteItemMutation = useMutation({
    mutationFn: deleteItem,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["items"] });
      toast.success("Successfully Deleted!", {
        description: "The Purchase Request sucessfully deleted.",
      });
    },
  });

  const actionDisabled = RESTRICTED_ACTION_STATUS.includes(status!)

  const handleItemDelete = () => {
    deleteItemMutation.mutate(selectedItemNo!);
  };
  return (
    <div className="border-none">
      <ItemForm pr_no={pr_no!} />
      <p className="font-bold pt-5">Items</p>
      <div className="grid grid-cols-7 gap-2 mb-4 items-center border-b-2 py-4">
        <Label className="text-base">Stock Property No.</Label>
        <Label className="text-base">Unit</Label>
        <Label className="text-base">Description</Label>
        <Label className="text-base">Quantity</Label>
        <Label className="text-base">Unit Cost</Label>
        <Label className="text-base">Total Cost</Label>
        <Label className="text-base">Actions</Label>
      </div>
      {sortedItems?.length ? (
        sortedItems.map((item) => (
          <div
            key={item.item_no}
            className="grid grid-cols-7 gap-2 mb-4 items-center p-2  border-b-2"
          >
            <Label>{item.stock_property_no}</Label>
            <Label>{item.unit}</Label>
            <Label>{item.item_description}</Label>
            <Label>{item.quantity}</Label>
            <Label>{item.unit_cost}</Label>
            <Label>{item.total_cost}</Label>
            <TooltipProvider delayDuration={100} skipDelayDuration={200}>
              <div className="flex gap-4 ">
                <Tooltip>
                  <TooltipTrigger asChild>
                    <div>
                      <Button
                        disabled={actionDisabled}
                        onClick={() => {
                          setSelectedItemNo(item.item_no);
                          setIsEditDialogOpen(true);
                        }}
                        variant="ghost"
                        className="flex h-8 w-8 p-0 data-[state=open]:bg-muted hover:rounded-full"
                      >
                        <Pencil1Icon className="h-4 w-4 text-orange-400" />
                        <span className="sr-only">Edit</span>
                      </Button>
                    </div>
                  </TooltipTrigger>
                  <TooltipContent side="top">
                    {actionDisabled
                      ? `You cannot edit items because it has already been ${status}`
                      : "Click to edit Items"}
                  </TooltipContent>
                </Tooltip>

                <Separator className="h-8" orientation="vertical" decorative />

                <Tooltip>
                  <TooltipTrigger asChild>
                    <div>
                      <Button
                        disabled={actionDisabled}
                        onClick={() => {
                          setIsDialogOpen(true);
                          setSelectedItemNo(item.item_no);
                        }}
                        variant="ghost"
                        className="flex h-8 w-8 p-0 data-[state=open]:bg-muted hover:rounded-full text-orange-400 hover:bg-red-400 hover:text-gray-100"
                      >
                        <TrashIcon className="h-4 w-4" />
                        <span className="sr-only">Delete</span>
                      </Button>
                    </div>
                  </TooltipTrigger>
                  <TooltipContent side="top">
                    {actionDisabled
                      ? `You cannot delete items because it has already been ${status}`
                      : "Click to delete Items"}
                  </TooltipContent>
                </Tooltip>
              </div>
            </TooltipProvider>
          </div>
        ))
      ) : (
        <div className="w-full flex items-center flex-col">
          <img src="/empty-box.svg" className="w-80 h-80" alt="Empty box" />
          <p>It looks a bit empty here! Start by adding a new item.</p>
        </div>
      )}
      <DeleteDialog
        onDeleteClick={handleItemDelete}
        message="Item"
        isDialogOpen={isDialogOpen}
        setIsDialogOpen={setIsDialogOpen}
      />
      <EditItemForm
        isEditDialogOpen={isEditDialogOpen}
        setIsEditDialogOpen={setIsEditDialogOpen}
        item_no={selectedItemNo!}
      />
    </div>
  );
};
