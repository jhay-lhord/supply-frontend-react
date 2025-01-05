/* eslint-disable react-hooks/rules-of-hooks */
"use client";

import { useState } from "react";
import {
  Search,
  FileText,
  Download,
  Printer,
  Loader2,
  RotateCcw,
} from "lucide-react";
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
import { GetItemInPurchaseRequest } from "@/services/itemServices";
import { generatePRPDF } from "@/services/generatePRPDF";
import { itemType } from "@/types/response/item";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";

type PDFType = "PR" | "RIS" | "ICS" | "PO";

const pdfTypes: { value: PDFType; label: string }[] = [
  { value: "PR", label: "PR PDF" },
  { value: "RIS", label: "RIS PDF" },
  { value: "ICS", label: "ICS PDF" },
  { value: "PO", label: "PO PDF" },
];

interface PDFGeneratorDialogProps {
  isOpen: boolean;
  setIsOpen: (open: boolean) => void;
}

const pdfConfig: Record<
  PDFType,
  { searchFn: (documentNo: string) => Promise<any> }
> = {
  PR: {
    searchFn: async (documentNo) => {
      const response = await GetItemInPurchaseRequest({ pr_no: documentNo });
      console.log(response)
      return (response.status === "success") && (response.data) ? response?.data as itemType : []
    },
  },
  RIS: {
    searchFn: async (documentNo) => {
      return { exampleKey: "RIS data" };
    },
  },
  ICS: {
    searchFn: async (documentNo) => {
      return { exampleKey: "ICS data" };
    },
  },
  PO: {
    searchFn: async (documentNo) => {
      return { exampleKey: "PO data" };
    },
  },
};

export default function PDFGeneratorDialog({
  isOpen,
  setIsOpen,
}: PDFGeneratorDialogProps) {
  const [selectedType, setSelectedType] = useState<PDFType>("PR");
  const [documentNo, setDocumentNo] = useState("");
  const [isSearching, setIsSearching] = useState(false);
  const [isFound, setIsFound] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);
  const [isPdfReady, setIsPdfReady] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [pdfData, setPdfData] = useState<itemType[]>([]);
  const [pdfUrl, setPdfUrl] = useState<string | null>(null);

  const handleSearch = async () => {
    setIsSearching(true);
    setError(null);

    try {
      const data = await pdfConfig[selectedType].searchFn(documentNo);
      console.log(data)
      if (data.length !== 0 ) {
        setPdfData(data);
        setIsFound(true);
      } else {
        throw new Error(`${documentNo} not found`);
      }
    } catch (err: any) {
      setError(err.message || "An error occurred while searching");
    } finally {
      setIsSearching(false);
    }
  };

  const handleGenerate = async () => {
    setIsGenerating(true);
    setError(null);
    // Simulating PDF generation
    const url = await generatePRPDF(pdfData);
    console.log(url);
    setPdfUrl(url);
    setIsPdfReady(true);
    setIsGenerating(false);
  };

  const handleDownload = () => {
    // Implement download logic here
    console.log(`Downloading ${selectedType} PDF...`);
  };

  const handleOpenPrint = () => {
    // Implement open/print logic here
    console.log(`Opening/Printing ${selectedType} PDF...`);
    window.open(pdfUrl!, "_blank");
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
                  <RotateCcw className="bg-muted h-9 w-9 rounded-md p-2" onClick={() => resetState()}/>
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
                  placeholder={`Enter ${selectedType} Number`}
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
                  <div className="flex items-center justify-around">
                    {documentNo}
                    <Button
                      onClick={handleGenerate}
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
                </AlertDescription>
              </Alert>
            )}
            {isPdfReady && (
              <div className="flex space-x-2">
                <Button onClick={handleDownload} className="flex-1">
                  <Download className="mr-2 h-4 w-4" />
                  Download
                </Button>
                <Button onClick={handleOpenPrint} className="flex-1">
                  <Printer className="mr-2 h-4 w-4" />
                  Open/Print
                </Button>
              </div>
            )}
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}
