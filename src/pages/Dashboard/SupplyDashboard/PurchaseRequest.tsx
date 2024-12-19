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
              <PlusIcon className="mr-2" /> Add Purchase Request
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
