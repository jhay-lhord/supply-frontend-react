import { useParams } from "react-router-dom";
import { usePurchaseRequestList } from "@/services/purchaseRequestServices";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  PurchaseRequestData,
  purchaseRequestFormSchema,
} from "@/types/request/purchase-request";
import { useEffect } from "react";
import Loading from "../../shared/components/Loading";
import { Building2, CreditCard, FileTextIcon, MapPinIcon } from "lucide-react";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import useStatusStore from "@/store";
import Layout from "./Layout/SupplyDashboardLayout";
import {
  useGetItemsDelivered,
  useGetPurchaseOrder,
} from "@/services/puchaseOrderServices";
import { generatePOPDF } from "@/services/generatePOPDF";

export default function PurchaseOrderItemList() {

  const { pr_no, po_no } = useParams();
  const { setStatus } = useStatusStore();
  const { data: purchase_request } = usePurchaseRequestList(pr_no!);

  const { data: purchase_order, isLoading } = useGetPurchaseOrder(po_no!);
  const { data: item_delivered } = useGetItemsDelivered()
  const purchaseOrderData = purchase_order?.data;
  console.log(purchaseOrderData);

  const purchaseData = purchase_request?.data;


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
      setValue("purpose", purchaseData?.purpose ?? "");
      setValue("office", purchaseData?.office ?? "");
      setValue("requisitioner", purchaseData?.requisitioner_details.name ?? "");
      setValue(
        "campus_director",
        purchaseData?.campus_director_details.name ?? ""
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

  const handleGeneratePDF = async () => {
    const itemDeliveredData = Array.isArray(item_delivered?.data) ? item_delivered.data : [];

    const pdfURL = await generatePOPDF(purchaseOrderData!, itemDeliveredData);
    return window.open(pdfURL!, "_blank")
  };


  return (
    <Layout>
      <div className=" w-full">
        {isLoading && <Loading/>}
        <Card className="w-full bg-slate-100">
          <CardHeader className="flex flex-col">
            <CardTitle className="">
              <div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <p className="font-thin">{purchaseOrderData?.po_no}</p>
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
                    {purchaseOrderData?.status}
                  </Badge>
                </div>
                <Separator className="mt-3" />
                <div className="flex items-center gap-4 mt-4">
                  <div className="flex items-center space-x-2">
                    <Building2 className="w-4 h-4 text-muted-foreground" />
                    <p className="text-sm font-medium">
                      {purchaseOrderData?.rfq_details.supplier_name}
                    </p>
                  </div>
                  <Separator orientation="vertical" className="h-8" />
                  <div className="flex items-center space-x-2">
                    <MapPinIcon className="w-4 h-4 text-muted-foreground" />
                    <p className="text-sm font-medium">
                      {purchaseOrderData?.rfq_details.supplier_address}
                    </p>
                  </div>
                  <Separator orientation="vertical" className="h-8" />
                  <div className="flex items-center space-x-2">
                    <CreditCard className="w-4 h-4 font-medium" />
                    <p className="text-sm font-medium">
                      TIN: {purchaseOrderData?.rfq_details.tin}
                    </p>
                  </div>
                  <Separator orientation="vertical" className="h-8" />

                  <Badge
                    variant={
                      purchaseOrderData?.rfq_details.is_VAT
                        ? "default"
                        : "secondary"
                    }
                  >
                    {purchaseOrderData?.rfq_details.is_VAT ? "VAT" : "non-VAT"}
                  </Badge>
                </div>
              </div>
              <div className="flex justify-start pt-8 pb-2">
                <div className="flex gap-1">
                  <Button className="bg-green-400 hover:bg-green-300 text-slate-950" onClick={handleGeneratePDF}>
                    <p className="mx-1 text-sm font-thin">Generate PDF</p>
                    <FileTextIcon className="w-4 h-4 mr-2" />
                  </Button>
                </div>
              </div>
            </CardTitle>

            <Separator className="pt-0 text-orange-300 bg-orange-200" />
          </CardHeader>
          <CardContent>
            <ItemList />
          </CardContent>
          <CardFooter className="flex justify-between"></CardFooter>
        </Card>
      </div>
    </Layout>
  );
}

const ItemList = () => {
  const { data, isLoading } = useGetItemsDelivered();
  const itemDeliveredData = Array.isArray(data?.data) ? data.data : [];

  if (isLoading) return <Loading />;

  return (
    <div className="border-none">
      <p className="font-bold">Items</p>
      <div className="grid grid-cols-6 gap-2 items-center border-b-2 py-4">
        <p className="text-base uppercase">Stock Property No.</p>
        <p className="text-base uppercase">Unit</p>
        <p className="text-base uppercase">Description</p>
        <p className="text-base uppercase">Quantity</p>
        <p className="text-base uppercase">Unit Cost</p>
        <p className="text-base uppercase">Amount</p>
        {/* <p className="text-base uppercase">Delivered Quantity</p> */}
      </div>
      {itemDeliveredData?.length ? (
        itemDeliveredData.map((item, index) => (
          <div
            key={item.inspection_details.po_details.po_no}
            className="grid grid-cols-6 gap-2 items-center py-6 border-b-2"
          >
            <p className="text-sm">{index + 1}</p>
            <p className="text-sm">
              {item.item_details.item_quotation_details.item_details.unit}
            </p>
            <p className="text-sm">
              {
                item.item_details.item_quotation_details.item_details
                  .item_description
              }
            </p>
            <p className="text-sm">
              {item.item_details.item_quotation_details.item_details.quantity}
            </p>
            <p className="text-sm">
              {item.item_details.item_quotation_details.unit_price}
            </p>
            <p className="text-sm">
              {Number(
                item.item_details.item_quotation_details.item_details.quantity
              ) * Number(item.item_details.item_quotation_details.unit_price)}
            </p>
            {/* <p className="text-sm">{item.quantity_delivered}</p> */}
          </div>
        ))
      ) : (
        <div className="w-full flex items-center flex-col">
          <img src="/empty-box.svg" className="w-80 h-80" alt="Empty box" />
          <p>It looks a bit empty here! Start by adding a new item.</p>
        </div>
      )}
    </div>
  );
};
