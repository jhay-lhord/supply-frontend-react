import { useGetAllSupplierItem } from "@/services/AbstractOfQuotationServices";
import { useGetAllPurchaseOrder } from "@/services/puchaseOrderServices";
import { useEffect, useMemo, useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { PackageOpen, PrinterIcon, ShoppingCart } from "lucide-react";
import { PurchaseOrderForm } from "./PurchaseOrderForm";
import Loading from "../../shared/components/Loading";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { usePurchaseRequest } from "@/services/purchaseRequestServices";

export default function SupplyAOQ() {
  const [supplierNo, setSupplierNo] = useState<string>("");
  const [prNo, setPrNo] = useState<string>("");
  const [totalAmount, setTotalAmount] = useState<number>(0);
  const [isDialogOpen, setIsDialogOpen] = useState<boolean>(false);

  const filteredStatus = "Ready to Order"
  const { data: purchase_order, isLoading } = useGetAllPurchaseOrder();
  const { data: items } = useGetAllSupplierItem();
  const { data: purchase_request } = usePurchaseRequest();

  const purchaseRequestData = useMemo(() => {
    return Array.isArray(purchase_request?.data) ? purchase_request.data : [];
  }, [purchase_request]);

  const filteredPurchaseRequestData = useMemo(() => {
    return purchaseRequestData.filter((data) => data.status === filteredStatus)
  }, [purchaseRequestData, filteredStatus]);


  const purchaseOrderData = useMemo(() => {
    return Array.isArray(purchase_order?.data) ? purchase_order.data : [];
  }, [purchase_order]);

  const usedPos = useMemo(() => {
    return purchaseOrderData
      .filter((data) => data.pr_details.pr_no === prNo)
      .map((data) => data.po_no);
  }, [purchaseOrderData, prNo]);

  const supplierItemData = useMemo(() => {
    return Array.isArray(items?.data) ? items.data : [];
  }, [items]);

  const suppliers = useMemo(() => {
    return Array.from(
      new Set(
        supplierItemData
          .filter(
            (data) =>
              data.supplier_details.aoq_details.pr_details.pr_no === prNo
          )
          .map((data) => data.supplier_details.supplier_no)
      )
    );
  }, [prNo, supplierItemData]);

  const isManySupplier = suppliers.length > 1;

  const handleOpenForm = (pr_no: string) => {
    setIsDialogOpen(true);
    setPrNo(pr_no);
  };

  useEffect(() => {
    if (!isDialogOpen) {
      setSupplierNo("");
      setTotalAmount(0);
    }
  }, [isDialogOpen]);

  if (isLoading) return <Loading />;

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>PR No.</TableHead>
          <TableHead>Requested By</TableHead>
          <TableHead>Office</TableHead>
          <TableHead>Purpose</TableHead>
          <TableHead>Action</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {filteredPurchaseRequestData && filteredPurchaseRequestData.length > 0 ? (
          filteredPurchaseRequestData?.map((item) => (
            <TableRow key={item.pr_no}>
              <TableCell>{item.pr_no}</TableCell>
              <TableCell>{item.requisitioner_details.name}</TableCell>
              <TableCell>{item.office}</TableCell>
              <TableCell>{item.purpose}</TableCell>
              <TableCell className="flex items-center gap-2">
                <TooltipProvider delayDuration={100}>
                  <Tooltip>
                    <TooltipTrigger>
                      <Button variant={"outline"}>
                        <PrinterIcon className="h-4 w-4" />
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent>Print NTP</TooltipContent>
                  </Tooltip>
                </TooltipProvider>
                <Button onClick={() => handleOpenForm(item.pr_no)}>
                  <ShoppingCart className="mr-2 h-4 w-4" />
                  Open
                </Button>
              </TableCell>
            </TableRow>
          ))
        ) : (
          <TableRow>
            <TableCell colSpan={7} className="h-24 text-center">
              <div className="flex flex-col items-center justify-center space-y-3">
                <PackageOpen className="h-8 w-8 text-gray-400" />
                <div className="text-lg font-medium text-gray-900">
                  No Orders in Progress
                </div>
                <div className="text-sm text-gray-500">
                  There are currently no orders in progress.
                </div>
              </div>
            </TableCell>
          </TableRow>
        )}
      </TableBody>
      <PurchaseOrderForm
        usedPos={usedPos}
        isManySupplier={isManySupplier}
        supplier_no={supplierNo!}
        pr_no={prNo}
        total_amount={totalAmount}
        isDialogOpen={isDialogOpen}
        setIsDialogOpen={setIsDialogOpen}
      />
    </Table>
  );
}
