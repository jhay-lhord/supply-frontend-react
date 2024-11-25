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

import { DownloadIcon, Printer, SendIcon } from "lucide-react";
import {
  Tooltip,
  TooltipProvider,
  TooltipTrigger,
  TooltipContent,
} from "@/components/ui/tooltip";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { OpenInNewWindowIcon } from "@radix-ui/react-icons";
import { QuotationCard } from "./QuotationCard";
import { AbstractForm } from "./AbstractForm";
import { generateEmptyAOQPDF } from "@/services/AbstractOfQuotationServices";

export default function Abstract() {
  const [isDialogOpen, setIsDialogOpen] = useState<boolean>(false);
  const [pdfUrl, setPdfUrl] = useState<string | undefined>(undefined);

  const { pr_no } = useParams();
  const {
    isLoading,
    data: purchase_request,
    error,
  } = usePurchaseRequestList(pr_no!);

  const navigate = useNavigate();

  const { setValue } = useForm<PurchaseRequestData>({
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
    const fetchPdfUrl = async () => {
      const url = await generateEmptyAOQPDF();
      setPdfUrl(url);
    };
    fetchPdfUrl();
  }, []);

  useEffect(() => {
    if (purchase_request?.data) {
      setValue("purpose", purchase_request.data.purpose || "");
      setValue("res_center_code", purchase_request.data.res_center_code || "");
      setValue("requested_by", purchase_request.data.requested_by || "");
      setValue("approved_by", purchase_request.data.approved_by || "");
      setValue("status", purchase_request.data.status);
    }
  }, [purchase_request, setValue]);

  if (isLoading) return <Loading />;
  if (error) return <div>{error.message}</div>;

  const handleAddAOQ = () => {
    setIsDialogOpen(true);
  };

  const handlePrintClick = async () => {
    window.open(pdfUrl, "_blank");
  };

  return (
    <div className="bg-slate-100 rounded-md w-full">
      <div className="flex place-content-between items-end py-2 rounded-md bg-orange-100">
        <div className="flex flex-col gap-1 p-8">
          <p>
            <span className="font-medium text-lg">PR Number: </span>
            <span className="text-red-400">{pr_no}</span>
          </p>
          <p className="flex items-center gap-2">
            <span className="font-medium text-lg">Status: </span>
            <Badge
              variant="destructive"
              className="bg-orange-300 text-slate-950 hover:bg-orange-200"
            >
              <p className="font-normal text-sm">{purchase_request?.data?.status}</p>
            </Badge>
          </p>
          <p>
            <span className="font-medium text-lg">Requested By: </span>
            <span className="">{purchase_request?.data?.requested_by}</span>
          </p>
          <p>
            <span className="font-medium text-lg">Purpose: </span>
            <span className="">{purchase_request?.data?.purpose}</span>
          </p>
          <p className="flex items-center gap-2">
            <div className="relative">
              <div className="font-medium text-lg hover:cursor-pointer flex gap-2 items-center">
                <p>Abstract of Qoutations:</p>
                <OpenInNewWindowIcon
                  width="25"
                  height="25"
                  onClick={() =>
                    navigate(`/bac/item-selected-quotation/${pr_no}`)
                  }
                />
              </div>
            </div>
          </p>
        </div>
        <div className="flex gap-4 p-8">
          <Button
            onClick={handleAddAOQ}
            variant={"outline"}
            className="bg-slate-100"
          >
            <p className="text-base font-light">Create AOQ</p>
          </Button>

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
              <TooltipContent side="top">Print Empty AOQ Form</TooltipContent>
            </Tooltip>

            <Tooltip>
              <TooltipTrigger asChild>
                <Button className="px-7 bg-orange-300 hover:bg-orange-200 text-slate-950">
                  <a href={pdfUrl} download={"Abstract_For_Quotation_Form.pdf"}>
                    <DownloadIcon strokeWidth={1.3} />
                  </a>
                </Button>
              </TooltipTrigger>
              <TooltipContent side="top">Download RFQ Form</TooltipContent>
            </Tooltip>

            <Tooltip>
              <TooltipTrigger asChild>
                <Button className="px-7 bg-orange-300 hover:bg-orange-200 text-slate-950">
                  <SendIcon strokeWidth={1.3} />
                </Button>
              </TooltipTrigger>
              <TooltipContent side="top">Send RFQ Form</TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </div>
      </div>
      <Separator className="" />
      <div className="p-8">
        <QuotationCard isDeleteAllowed={false} title={"All Supplier"} />
      </div>

      <AbstractForm
        isDialogOpen={isDialogOpen}
        setIsDialogOpen={setIsDialogOpen}
      />
    </div>
  );
}
