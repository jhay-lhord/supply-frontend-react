import { useNavigate, useParams } from "react-router-dom";
import { usePurchaseRequestList } from "@/services/purchaseRequestServices";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  PurchaseRequestData,
  purchaseRequestFormSchema,
} from "@/types/request/purchase-request";
import { useEffect } from "react";
import Loading from "../../shared/components/Loading";

import {
  CalendarIcon,
  DownloadIcon,
  Printer,
  SquareArrowOutUpRightIcon,
  TargetIcon,
  UserIcon,
} from "lucide-react";
import {
  Tooltip,
  TooltipProvider,
  TooltipTrigger,
  TooltipContent,
} from "@/components/ui/tooltip";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { QuotationCard } from "./QuotationCard";
import {
  generateEmptyAOQPDF,
  useAbstractOfQuotation,
  useGetAllSupplierItem,
} from "@/services/AbstractOfQuotationServices";
import { generateAOQPDF } from "@/services/generateAOQPDF";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { formatDate } from "@/services/formatDate";

export default function Abstract() {
  const [pdfUrl, setPdfUrl] = useState<string | undefined>(undefined);

  const { pr_no } = useParams();

    useAbstractOfQuotation();
  const { data: items } = useGetAllSupplierItem();

  const supplierItemData = Array.isArray(items?.data) ? items.data : []

  const {
    isLoading,
    data: purchase_request,
    error,
  } = usePurchaseRequestList(pr_no!);

  const purchaseRequestData = purchase_request?.data;

  const navigate = useNavigate();

  const { setValue } = useForm<PurchaseRequestData>({
    resolver: zodResolver(purchaseRequestFormSchema),
    defaultValues: {
      pr_no: pr_no,
      purpose: purchaseRequestData?.purpose,
      status: purchaseRequestData?.status,
      office: purchaseRequestData?.office,
      requisitioner: purchaseRequestData?.requisitioner_details.name,
      campus_director: purchaseRequestData?.campus_director_details.name,
    },
  });

  useEffect(() => {
    const fetchPdfUrl = async () => {
      const url = await generateEmptyAOQPDF();
      setPdfUrl(url);
    };
    fetchPdfUrl();
  }, []);

  useEffect(() => {
    if (purchaseRequestData) {
      setValue("purpose", purchaseRequestData?.purpose ?? "");
      setValue("office", purchaseRequestData?.office ?? "");
      setValue(
        "requisitioner",
        purchaseRequestData?.requisitioner_details.name ?? ""
      );
      setValue(
        "campus_director",
        purchaseRequestData?.campus_director_details.name ?? ""
      );
      setValue("status", purchaseRequestData?.status);
    }
  }, [purchaseRequestData, setValue]);

  if (isLoading) return <Loading />;
  if (error) return <div>{error.message}</div>;


  const handlePrintClick = async () => {
    const url = await generateAOQPDF(supplierItemData!);
    window.open(url!, "_blank");
  };

  return (
  
    <div className="w-full">
      <Card className="w-full bg-slate-100">
        <CardHeader className="flex flex-col">
          <CardTitle className="">
            <div>
              <div className="flex items-center justify-between">
                <div className="">
                  <p className="font-thin">{purchaseRequestData?.pr_no}</p>
                  <div className="flex items-center pt-2">
                    <CalendarIcon className="w-3 h-3 mr-1" />
                    <p className="text-sm font-thin">
                      {purchaseRequestData?.created_at &&
                        formatDate(purchaseRequestData?.created_at)}
                    </p>
                  </div>
                </div>

                <Badge>{purchaseRequestData?.status}</Badge>
              </div>
              <Separator className="mt-3" />
              <div className="flex items-center gap-4 mt-2">
                <div className="flex items-center">
                  <UserIcon className="w-4 h-4 mr-1" />
                  <p className="text-lg font-thin">
                    {purchaseRequestData?.requisitioner_details.name}
                  </p>
                </div>
                <Separator orientation="vertical" className="h-6" />
                <div className="flex items-center">
                  <TargetIcon className="w-4 h-4 mr-1" />
                  <p className="text-lg font-thin">
                    {purchaseRequestData?.purpose}
                  </p>
                </div>
              </div>
            </div>
          </CardTitle>
          <div className="py-4">
            <div className="flex justify-between gap-1">
              <Button
                className="bg-green-400 hover:bg-green-500"
                onClick={() =>
                  navigate(`/bac/item-selected-quotation/${pr_no}`)
                }
              >
                <p className="mr-2">View Abstract of Quotation</p>
                <SquareArrowOutUpRightIcon className="w-4 h-4 mr-2" />
              </Button>
              <div className="flex gap-4">
                <TooltipProvider delayDuration={100} skipDelayDuration={200}>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button
                        className="px-7 bg-orange-300 hover:bg-orange-200 text-slate-950"
                        onClick={handlePrintClick}
                      >
                        <Printer strokeWidth={1.3} />
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent side="top">
                      Print AOQ Details
                    </TooltipContent>
                  </Tooltip>

                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button className="px-7 bg-orange-300 hover:bg-orange-200 text-slate-950">
                        <a
                          href={pdfUrl}
                          download={"Request_For_Quotation_Form.pdf"}
                        >
                          <DownloadIcon strokeWidth={1.3} />
                        </a>
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent side="top">
                      Download AOQ Form
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              </div>
            </div>
          </div>
          <Separator className="pt-0 text-orange-300 bg-orange-200" />
        </CardHeader>
        <CardContent>
          <QuotationCard isDeleteAllowed={false} title={"All Supplier"} />
        </CardContent>
        <CardFooter className="flex justify-between"></CardFooter>
      </Card>
    </div>
  );
}
