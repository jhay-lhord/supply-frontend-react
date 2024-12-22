import PurchaseRequestDataTable from "./components/PurchaseRequestDataTable";
import Layout from "./components/Layout/SupplyDashboardLayout";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { PlusIcon } from "lucide-react";
import { useState } from "react";
import PurchaseRequestForm from "./components/PurchaseRequestForm";
import { purchaseRequestType } from "@/types/response/puchase-request";
import { usePurchaseRequest } from "@/services/purchaseRequestServices";
import { arraySort } from "@/services/itemServices";
import { generateNOWPDF } from "@/services/generateNOWPDF";
import { pdf } from "@react-pdf/renderer";

const PurchaseRequest: React.FC = () => {
  const [isDialogOpen, setIsDialogOpen] = useState<boolean>(false);
  const { data } = usePurchaseRequest();

  const purchaseRequestData: purchaseRequestType[] =
    data?.status === "success" ? data.data || [] : [];

  const sortedPurchaseRequestData = arraySort(purchaseRequestData, "pr_no");

  const lastPrNo = sortedPurchaseRequestData?.length
    ? sortedPurchaseRequestData[sortedPurchaseRequestData.length - 1].pr_no
    : undefined;
  console.log(lastPrNo);

  const handleOpenDialog = () => {
    setIsDialogOpen(true);
  };

  const handleGeneratePDF = async () => {
    try {
      
      const awardNoticeData = {
        date: 'January 12, 2024',
        recipient: {
          name: 'CGR PRINT SHOP',
          address: ['Udlog St., Cansojong', 'Talisay City, Cebu'],
        },
        awardDetails: {
          officeSupply: 'OFFICE SUPPLY FOR REGISTRAR\'S OFFICE',
          date: 'JANUARY 05, 2024',
          amount: 19950,
        },
        signatory: {
          name: 'ENGILBERT C. BENOLIRAO, DEV.ED.D.',
          title: 'Campus Director / Head of Procuring Entity',
        },
      }

      // Generate PDF blob
      const doc = generateNOWPDF(awardNoticeData)
      const blob = await pdf(doc).toBlob()
      
      // Create object URL
      const url = URL.createObjectURL(blob)
      
      // Open PDF in a new window
      const newWindow = window.open(url, '_blank');
      if (newWindow) {
        newWindow.document.title = 'NOA.pdf';
      }
      
      // Cleanup
      URL.revokeObjectURL(url)
    } catch (error) {
      console.error('Error generating PDF:', error)
    } finally {
      setIsGenerating(false)
    }
  }

  return (
    <Layout>
      <Card className="bg-slate-100 w-full">
        <CardHeader className="">
          <CardTitle className="flex justify-between">
            Purchase request
            <Button
              className="mb-4 hover:bg-orange-300 text-black"
              onClick={handleOpenDialog}
            >
              <PlusIcon className="mr-2 h-4 w-4" /> <p className="font-normal">Add Purchase Request</p>
            </Button>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <PurchaseRequestDataTable />
        </CardContent>
      </Card>
      <PurchaseRequestForm
        isDialogOpen={isDialogOpen}
        setIsDialogOpen={setIsDialogOpen}
        lastPrNo={lastPrNo?.toString()}
      />
    </Layout>
  );
};

export default PurchaseRequest;
