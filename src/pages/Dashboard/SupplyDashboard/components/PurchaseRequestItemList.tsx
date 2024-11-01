import { useParams } from "react-router-dom";
import {
  deleteItem,
  FilteredItemInPurchaseRequest,
  arraySort,
} from "@/services/itemServices";
import { usePurchaseRequestList } from "@/services/purchaseRequestServices";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
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
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";
import { itemType } from "@/types/response/item";
import { useEffect } from "react";
import ItemForm from "./ItemForm";
import { toast } from "sonner";
import { DeleteDialog } from "./DeleteDialog";
import Loading from "../../shared/components/Loading";
import EditItemForm from "./EditItemForm";
import { purchaseRequestType } from "@/types/response/puchase-request";
import { useUpdatePurchaseRequest } from "@/services/purchaseRequestServices";
import { Loader2 } from "lucide-react";
import { generatePDF } from "@/services/purchaseRequestServices";
import { useNavigate } from "react-router-dom";


export default function PurchaseRequestItemList() {
  const [isDialogOpen, setIsDialogOpen] = useState<boolean>(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const { pr_no } = useParams();
  const items = FilteredItemInPurchaseRequest(pr_no!);
  const {
    isLoading,
    data: purchase_request,
    error,
  } = usePurchaseRequestList(pr_no!);

  const navigate = useNavigate()

  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
  } = useForm<PurchaseRequestData>({
    resolver: zodResolver(purchaseRequestFormSchema),
    defaultValues: {
      pr_no: pr_no,
      purpose: purchase_request?.data?.purpose,
      status: purchase_request?.data?.status,
      res_center_code: purchase_request?.data?.res_center_code,
      requested_by: purchase_request?.data?.requested_by,
      approved_by: purchase_request?.data?.approved_by,
    },
  });

  const { mutate, isPending } = useUpdatePurchaseRequest();

  useEffect(() => {
    if (purchase_request?.data) {
      setValue("purpose", purchase_request.data.purpose || "");
      setValue("res_center_code", purchase_request.data.res_center_code || "");
      setValue("requested_by", purchase_request.data.requested_by || "");
      setValue("approved_by", purchase_request.data.approved_by || "");
      setValue("status", purchase_request.data.status);
    }
  }, [purchase_request, setValue]);

  let sortedItems;
  if (!isLoading) {
    sortedItems = arraySort(items!, "stock_property_no");
  }

  const onSubmit = (data: purchaseRequestType) => {
    const result = purchaseRequestFormSchema.safeParse(data);

    if (result.success) {
      mutate(data);
      setIsDialogOpen(false);
      setIsEditMode(false);
    }
    setIsDialogOpen(false);
    if (!isPending) setIsEditMode(false);
  };

  const handleEditClick = () => setIsEditMode(true);
  const handleCancelClick = () => setIsEditMode(false);

  const handleGeneratePDF = async () => {
    const purchaseRequestData = purchase_request?.data
    const itemsData = items ? items : []
    const pdfURL = await generatePDF(itemsData, purchaseRequestData!);
    return itemsData.length != 0 ? window.open(pdfURL!, "_blank") : navigate("/supply/not-found")
    
  };

  if (isLoading) return <Loading />;
  if (error) return <div>{error.message}</div>;

  return (
    <div className="m-8">
      <div className="flex place-content-between items-center py-2 ">
        <div>
          <p>
            <span className="font-bold text-lg">PR Number: </span> {pr_no}
          </p>
          <p>
            <span className="font-bold text-lg">Status: </span>
            {purchase_request?.data?.status}
          </p>
        </div>
        <Button
          onClick={handleGeneratePDF}
          className="px-7 bg-orange-200 hover:bg-orange-300 text-slate-950"
        >
          Generate PR
        </Button>
      </div>
      <form
        onSubmit={handleSubmit((data) => onSubmit(data))}
        className="border-none bg-slate-100 rounded p-8"
      >
        <div className="flex gap-4 py-2">
          <InputField
            label="Res Center Code"
            name="res_center_code"
            disabled={!isEditMode}
            register={register}
            error={errors.res_center_code}
          />
          <InputField
            label="Purpose"
            name="purpose"
            disabled={!isEditMode}
            register={register}
            error={errors.purpose}
          />
          <InputField
            label="Requested By"
            name="requested_by"
            disabled={!isEditMode}
            register={register}
            error={errors.requested_by}
          />
          <InputField
            label="Approved By"
            name="approved_by"
            disabled={!isEditMode}
            register={register}
            error={errors.approved_by}
          />
          <SelectField
            label="Status"
            name="status"
            options={[
              { value: "Ready for Canvassing", label: "Ready for Canvassing" },
              {
                value: "Ready for Purchase Order",
                label: "Ready for Purchase Order",
              },
              {
                value: "Forwarded to Procurement",
                label: "Forwarded to Procurement",
              },
            ]}
            disabled={!isEditMode}
            defaultValue={purchase_request?.data?.status}
            setValue={setValue}
            error={errors.status}
          />
        </div>
        {isEditMode ? (
          <div className="flex gap-2 mt-4">
            <Button
              type="button"
              className="border-2 bg-white text-slate-900 border-slate-500 hover:text-slate-50"
              onClick={handleCancelClick}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              className={`bg-green-500 ${isPending && "px-14"}`}
            >
              {isPending ? (
                <Loader2 className="animate-spin" />
              ) : (
                "Save Changes"
              )}
            </Button>
          </div>
        ) : (
          <Button
            type="button"
            className="mt-4 bg-orange-200 hover:bg-orange-300 text-slate-950"
            onClick={handleEditClick}
          >
            <Pencil1Icon className="mr-2" /> Edit
          </Button>
        )}
      </form>

      <ItemList sortedItems={sortedItems!} />

      <PurchaseRequestForm
        isDialogOpen={isDialogOpen}
        setIsDialogOpen={setIsDialogOpen}
        lastPrNo={pr_no}
      />
    </div>
  );
}

const ErrorMessage = ({ message }: { message?: string }) =>
  message ? <p className="text-red-500 text-sm mt-1">{message}</p> : null;

const InputField = ({
  label,
  name,
  disabled,
  register,
  error,
}: {
  label: string;
  name: string;
  register: any;
  disabled: boolean;
  error?: { message?: string };
}) => (
  <div>
    <Label className="text-base">{label}</Label>
    <Input
      className="mt-4"
      {...register(name)}
      placeholder={label}
      disabled={disabled}
    />
    <ErrorMessage message={error?.message} />
  </div>
);

const SelectField = ({
  label,
  name,
  options,
  disabled,
  defaultValue,
  setValue,
  error,
}: {
  label: string;
  name: keyof PurchaseRequestData;
  options: { value: string; label: string }[];
  disabled: boolean;
  defaultValue: string | undefined;
  setValue: (name: keyof PurchaseRequestData, value: any) => void;
  error?: { message?: string };
}) => (
  <div>
    <Label className="text-base">{label}</Label>
    <Select
      disabled={disabled}
      onValueChange={(value) => setValue(name, value)}
    >
      <SelectTrigger className="w-[250px] mt-4">
        <SelectValue placeholder={defaultValue} />
      </SelectTrigger>
      <SelectContent defaultValue={defaultValue}>
        {options.map((option) => (
          <SelectItem key={option.value} value={option.value}>
            {option.label}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
    <ErrorMessage message={error?.message} />
  </div>
);

const ItemList = ({ sortedItems }: { sortedItems: itemType[] }) => {
  const [isDialogOpen, setIsDialogOpen] = useState<boolean>(false);
  const [selectedItemNo, setSelectedItemNo] = useState<string | null>(null);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState<boolean>(false);
  const { pr_no } = useParams();
  const queryClient = useQueryClient();

  const deleteItemMutation = useMutation({
    mutationFn: deleteItem,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["items"] });
      toast.success("Successfully Deleted!", {
        description: "The Purchase Request sucessfully deleted.",
      });
    },
  });

  const handleItemDelete = () => {
    deleteItemMutation.mutate(selectedItemNo!);
  };
  return (
    <div className="border-none bg-slate-100 rounded mt-4 p-8">
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
                    <Button
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
                  </TooltipTrigger>
                  <TooltipContent side="top">Edit</TooltipContent>
                </Tooltip>

                <Separator className="h-8" orientation="vertical" decorative />

                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button
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
                  </TooltipTrigger>
                  <TooltipContent side="top">Delete</TooltipContent>
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
