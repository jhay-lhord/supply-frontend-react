import { useParams } from "react-router-dom";
import { FilteredItemInPurchaseRequest } from "@/services/itemServices";
import {
  UpdatePurchaseRequest,
  usePurchaseRequestList,
} from "@/services/purchaseRequestServices";
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
import ExcelJS from "exceljs";
import { saveAs } from "file-saver";
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

export default function PurchaseRequestItemList() {
  const [isDialogOpen, setIsDialogOpen] = useState<boolean>(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const { pr_no } = useParams();
  const queryClient = useQueryClient();
  const items = FilteredItemInPurchaseRequest(pr_no!);
  const {
    isLoading,
    data: purchase_request,
    error,
  } = usePurchaseRequestList(pr_no!);

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

  useEffect(() => {
    if (purchase_request?.data) {
      setValue("purpose", purchase_request.data.purpose || "");
      setValue("res_center_code", purchase_request.data.res_center_code || "");
      setValue("requested_by", purchase_request.data.requested_by || "");
      setValue("approved_by", purchase_request.data.approved_by || "");
      setValue("status", purchase_request.data.status);
    }
  }, [purchase_request, setValue]);

  const updatePurchaseRequestMutation = useMutation({
    mutationFn: UpdatePurchaseRequest,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["purchase_request"] });
      setIsEditMode(false);
    },
  });

  const onSubmit = (data: PurchaseRequestData) => {
    updatePurchaseRequestMutation.mutate(data);
    setIsDialogOpen(false);
  };

  const handleEditClick = () => setIsEditMode(true);
  const handleCancelClick = () => setIsEditMode(false);

  const ExcelExport = async () => {
    try {
      const response = await fetch("/Appendix%2060%20-%20PR.xlsx");
      const data = await response.arrayBuffer();
      const workbook = new ExcelJS.Workbook();
      await workbook.xlsx.load(data);
      const worksheet = workbook.getWorksheet(1);

      worksheet.getCell(
        "C8:E8"
      ).value = `PR No.: ${purchase_request?.data?.pr_no}`;
      worksheet.getCell(
        "F8:G8"
      ).value = `Date: ${purchase_request?.data?.created_at}`;
      worksheet.getCell(
        "C9:E9"
      ).value = `Responsibility Center Code: ${purchase_request?.data?.res_center_code}`;
      worksheet.getCell("B39:G39").value = purchase_request?.data?.purpose;

      const buffer = await workbook.xlsx.writeBuffer();
      saveAs(new Blob([buffer]), "updated-final-Appendix-60-PR.xlsx");
    } catch (error) {
      console.error("Error generating Excel file:", error);
    }
  };

  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>{error.message}</div>;

  return (
    <div className="m-8">
      <div className="flex place-content-between items-center py-2">
        <div>
          <p>
            <span className="font-bold text-lg">PR Number:</span> {pr_no}
          </p>
          <p>
            <span className="font-bold text-lg">Status:</span>
            {purchase_request?.data?.status}
          </p>
        </div>
        <Button
          className="px-7 bg-orange-200 hover:bg-orange-300 text-slate-950"
          onClick={ExcelExport}
        >
          Print PR
        </Button>
      </div>
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="border-2 border-orange-200 rounded p-2"
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
            <Button type="submit" className="bg-green-500">
              Save Changes
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

      <ItemList items={items!} />

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
    <Input {...register(name)} placeholder={label} disabled={disabled} />
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
      <SelectTrigger className="w-[180px]">
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

const ItemList = ({ items }: { items: itemType[] }) => {
  const { pr_no } = useParams();
  return (
    <div className="border-2 border-orange-200 rounded mt-4 p-2">
      <ItemForm pr_no={pr_no!} />
      <p className="font-bold pt-5">Items</p>
      <div className="grid grid-cols-7 gap-2 mb-4 items-center border-b-2 py-4">
        <Label>Stock Property Number</Label>
        <Label>Unit</Label>
        <Label>Description</Label>
        <Label>Quantity</Label>
        <Label>Unit Cost</Label>
        <Label>Total Cost</Label>
        <Label>Actions</Label>
      </div>
      {items?.length ? (
        items.map((item) => (
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
        <div className="text-center bg-slate-200 p-1 rounded">
          <p>It looks a bit empty here! Start by adding a new item.</p>{" "}
        </div>
      )}
    </div>
  );
};
