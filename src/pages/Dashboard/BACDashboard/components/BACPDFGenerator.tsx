import { useState } from "react";
import { Search, FileText, Loader2, RotateCcw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Alert, AlertDescription } from "@/components/ui/alert";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { getAllSupplierItem } from "@/services/AbstractOfQuotationServices";
import { supplierItemType_ } from "@/types/response/abstract-of-quotation";
import { generateNTPPDF } from "@/services/generateNTPPDF";
import { pdf } from "@react-pdf/renderer";
import { generateNOAPDF } from "@/services/generateNOWPDF";

type PDFType = "NOA" | "NTP";

const pdfTypes: { value: PDFType; label: string }[] = [
  { value: "NOA", label: "NOA PDF" },
  { value: "NTP", label: "NTP PDF" },
];

interface PDFGeneratorDialogProps {
  isOpen: boolean;
  setIsOpen: (open: boolean) => void;
}

const pdfConfig: Record<
  PDFType,
  { searchFn: (documentNo: string) => Promise<unknown> }
> = {
  NTP: {
    searchFn: async (documentNo) => {
      const response = await getAllSupplierItem();
      const supplierItem = Array.isArray(response.data) ? response.data : [];
      const filteredSupplierItem = supplierItem.filter(
        (data) => data.supplier_details.aoq_details.aoq_no === documentNo
      );
      return response.status === "success" && response.data
        ? (filteredSupplierItem as supplierItemType_[])
        : [];
    },
  },
  NOA: {
    searchFn: async (documentNo) => {
      const response = await getAllSupplierItem();
      const supplierItem = Array.isArray(response.data) ? response.data : [];
      const filteredSupplierItem = supplierItem.filter(
        (data) => data.supplier_details.aoq_details.aoq_no === documentNo
      );
      return response.status === "success" && response.data
        ? (filteredSupplierItem as supplierItemType_[])
        : [];
    },
  },
};

export default function PDFGeneratorDialog({
  isOpen,
  setIsOpen,
}: PDFGeneratorDialogProps) {
  const [selectedType, setSelectedType] = useState<PDFType>("NTP");
  const [documentNo, setDocumentNo] = useState("");
  const [isSearching, setIsSearching] = useState(false);
  const [isFound, setIsFound] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);
  const [isPdfReady, setIsPdfReady] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [pdfData, setPdfData] = useState<supplierItemType_[]>([]);

  const supplierName = Array.from(
    new Set(pdfData.map((data) => data.rfq_details.supplier_name))
  );

  const handleSearch = async () => {
    setIsSearching(true);
    setError(null);

    try {
      const data = await pdfConfig[selectedType].searchFn(documentNo);
      console.log(data);
      if (Array.isArray(data) && data.length !== 0) {
        setPdfData(data);
        setIsFound(true);
      } else {
        throw new Error(
          `No Supplier information found for AOQ No. ${documentNo}`
        );
      }
    } catch (err: unknown) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError("An error occurred while searching");
      }
    } finally {
      setIsSearching(false);
    }
  };

  const handleGenerate = async (supplier_name: string) => {
    setIsGenerating(true);
    setError(null);
    const supplierData = pdfData.find(data => data.rfq_details.supplier_name === supplier_name )
    const blob = (selectedType === "NTP") ? await pdf(generateNTPPDF(supplierData!)).toBlob() : await pdf(generateNOAPDF(supplierData!)).toBlob()

    // Create a Blob URL
    const blobUrl = URL.createObjectURL(blob);

    // Open the Blob URL in a new tab
    window.open(blobUrl, "_blank");
    setIsGenerating(false);
  };

  const resetState = () => {
    setDocumentNo("");
    setIsFound(false);
    setIsPdfReady(false);
    setError(null);
  };

  return (
    <>
      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle>Generate PDF</DialogTitle>
          </DialogHeader>
          <div className="flex flex-col space-y-4 pb-4">
            <div className="flex justify-end">
              <Tooltip delayDuration={100}>
                <TooltipTrigger>
                  <RotateCcw
                    className="bg-muted h-9 w-9 rounded-md p-2"
                    onClick={() => resetState()}
                  />
                </TooltipTrigger>
                <TooltipContent>Refresh</TooltipContent>
              </Tooltip>
            </div>
            <div className="flex flex-col space-y-2">
              <Label htmlFor="pdf-type">PDF Type</Label>
              <Select
                value={selectedType}
                onValueChange={(value: PDFType) => {
                  setSelectedType(value);
                  resetState();
                }}
              >
                <SelectTrigger id="pdf-type">
                  <SelectValue placeholder="Select PDF type" />
                </SelectTrigger>
                <SelectContent>
                  {pdfTypes.map((type) => (
                    <SelectItem key={type.value} value={type.value}>
                      {type.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="flex flex-col space-y-2">
              <Label htmlFor="document-no">{`${selectedType} No.`}</Label>
              <div className="flex">
                <Input
                  id="document-no"
                  value={documentNo}
                  onChange={(e) => setDocumentNo(e.target.value)}
                  className="rounded-r-none"
                  placeholder={`Enter AOQ Number`}
                  disabled={isSearching || isFound}
                />
                <Button
                  onClick={handleSearch}
                  disabled={!documentNo || isSearching || isFound}
                  className="rounded-l-none rounded-r-md"
                >
                  {isSearching ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  ) : (
                    <Search className="h-4 w-4" />
                  )}
                </Button>
              </div>
            </div>
            {error && (
              <Alert variant="destructive">
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}
            {isFound && (
              <Alert variant="default">
                <AlertDescription>
                  <div className="flex flex-col items-center justify-around w-full">
                    {supplierName.map((supplier) => (
                      <div className="flex justify-between gap-2 w-full my-2">
                        <p>{supplier}</p>
                        <Button
                          onClick={() => handleGenerate(supplier)}
                          disabled={isGenerating || isPdfReady}
                          size="sm"
                        >
                          {isGenerating ? (
                            <>
                              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                              Generating...
                            </>
                          ) : (
                            <>
                              <FileText className="mr-2 h-4 w-4" />
                              Generate PDF
                            </>
                          )}
                        </Button>
                      </div>
                    ))}
                  </div>
                </AlertDescription>
              </Alert>
            )}
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}
