import {
  useGetAllSupplier,
  useGetAllSupplierItem,
} from "@/services/AbstractOfQuotationServices";
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
import { formatDate } from "@/utils/formateDate";
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
import { generatePOPDF } from "@/services/generatePOPDF";

export default function SupplyAOQ() {
  const [supplierNo, setSupplierNo] = useState<string>("");
  const [prNo, setPrNo] = useState<string>("");
  const [totalAmount, setTotalAmount] = useState<number>(0);
  const [isDialogOpen, setIsDialogOpen] = useState<boolean>(false);

  const { data: purchase_order, isLoading } = useGetAllPurchaseOrder();
  const { data: items } = useGetAllSupplierItem();
  const { data: supplier } = useGetAllSupplier();

  console.log(items)

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

  const supplier_no = purchaseOrderData
    .filter((data) => data.supplier_details.supplier_no)
    .map((data) => data.supplier_details.supplier_no);

  const filteredSupplierData = useMemo(() => {
    const supplierData = Array.isArray(supplier?.data) ? supplier.data : [];
    return supplierData.filter(
      (data) => !supplier_no.includes(data.supplier_no)
    );
  }, [supplier?.data, supplier_no]);

  const countItemsBySupplier = (supplierName: string) =>
    supplierItemData.filter(
      (data) => data.rfq_details.supplier_name === supplierName
    ).length;

  const totalAmountPerSupplier = (supplier_no: string) => {
    return supplierItemData
      .filter((data) => data.supplier_details.supplier_no === supplier_no)
      .reduce(
        (accumulator, item) => Number(accumulator) + Number(item.total_amount),
        0
      );
  };

  const handleOpenForm = (
    supplier_no: string,
    pr_no: string,
    total_amount: number
  ) => {
    setIsDialogOpen(true);
    setSupplierNo(supplier_no);
    setPrNo(pr_no);
    setTotalAmount(total_amount);
  };

  const handleGeneratePDF = async (supplier_name: string) => {
    const supplierItems = supplierItemData.filter(data => data.rfq_details.supplier_name.toLowerCase() === supplier_name.toLowerCase())
    console.log(supplierItems)

    // const pdfURL = await generatePOPDF(purchaseOrderData!, supplierItems);
    // return window.open(pdfURL!, "_blank")
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
          <TableHead>AOQ No.</TableHead>
          <TableHead>Supplier</TableHead>
          <TableHead>Items</TableHead>
          <TableHead>Total Amount</TableHead>
          <TableHead>Created At</TableHead>
          <TableHead>Action</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {filteredSupplierData.length > 0 ? (
          filteredSupplierData.map((item) => (
            <TableRow key={item.supplier_no}>
              <TableCell>{item.aoq_details.aoq_no}</TableCell>
              <TableCell>{item.rfq_details.supplier_name}</TableCell>
              <TableCell>
                {countItemsBySupplier(item.rfq_details.supplier_name)} Items{" "}
              </TableCell>
              <TableCell>₱{totalAmountPerSupplier(item.supplier_no)}</TableCell>
              <TableCell>{formatDate(item.created_at)}</TableCell>
              <TableCell className="flex items-center gap-2">
                <TooltipProvider delayDuration={100}>
                  <Tooltip>
                    <TooltipTrigger>
                      <Button variant={"outline"} onClick={() => handleGeneratePDF(item.rfq_details.supplier_name)}>
                        <PrinterIcon className="h-4 w-4" />
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent>
                      Print NTP 
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
                <Button
                  onClick={() =>
                    handleOpenForm(
                      item.supplier_no,
                      item.aoq_details.pr_details.pr_no,
                      Number(totalAmountPerSupplier(item.supplier_no))
                    )
                  }
                >
                  <ShoppingCart className="mr-2 h-4 w-4" />
                  Place Order
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
