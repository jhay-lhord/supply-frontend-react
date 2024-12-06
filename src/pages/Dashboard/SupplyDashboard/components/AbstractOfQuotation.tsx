import {
  useAbstractOfQuotation,
  useAllItemSelectedQuote,
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
import { PackageOpen, ShoppingCart } from "lucide-react";
import { PurchaseOrderForm } from "./PurchaseOrderForm";
import Loading from "../../shared/components/Loading";

export default function SupplyAOQ() {
  const [aoqNo, setAoq] = useState<string>("");
  const [prNo, setPrNo] = useState<string>("");
  const [totalAmount, setTotalAmount] = useState<number>(0);
  const [isDialogOpen, setIsDialogOpen] = useState<boolean>(false);

  const { data, isLoading } = useAbstractOfQuotation();
  const { data: purchase_order } = useGetAllPurchaseOrder();
  const { data: items } = useAllItemSelectedQuote();

  const itemsData = Array.isArray(items?.data) ? items.data : [];
  const itemCount = (aoq_no:string) => (
    itemsData.filter(item => item.aoq === aoq_no).length
  )

  const purchaseOrderData = Array.isArray(purchase_order?.data)
    ? purchase_order.data
    : [];

  const po_no = purchaseOrderData
    .filter((data) => data.po_no)
    .map((data) => data.po_no);

  const filteredAbstractData = useMemo(() => {
    const abstractData = Array.isArray(data?.data) ? data.data : [];
    return abstractData.filter((data) => !po_no.includes(data.aoq_no));
  }, [data?.data, po_no]);

  const handleOpenForm = (
    aoq_no: string,
    pr_no: string,
    total_amount: number
  ) => {
    setIsDialogOpen(true);
    setAoq(aoq_no);
    setPrNo(pr_no);
    setTotalAmount(total_amount);
  };

  useEffect(() => {
    if(!isDialogOpen){
      setAoq("")
      setTotalAmount(0)
    }
  }, [isDialogOpen])

  if (isLoading) return <Loading />;

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Order Number</TableHead>
          <TableHead>Supplier</TableHead>
          <TableHead>Items</TableHead>
          <TableHead>Total Amount</TableHead>
          <TableHead>Created At</TableHead>
          <TableHead>Action</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {filteredAbstractData.length > 0 ? (
          filteredAbstractData.map((abstract) => (
            <TableRow key={abstract.aoq_no}>
              <TableCell>{abstract.pr_details.pr_no}</TableCell>
              <TableCell>{abstract.rfq_details.supplier_name}</TableCell>
              <TableCell>{itemCount(abstract.aoq_no)} Items </TableCell>
              <TableCell>₱{abstract.total_amount}</TableCell>
              <TableCell>
                {formatDate(abstract.created_at)}
              </TableCell>
              <TableCell>
                <Button
                  onClick={() =>
                    handleOpenForm(
                      abstract.aoq_no,
                      abstract.pr_details.pr_no,
                      Number(abstract.total_amount)
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
        aoq_no={aoqNo!}
        pr_no={prNo}
        total_amount={totalAmount}
        isDialogOpen={isDialogOpen}
        setIsDialogOpen={setIsDialogOpen}
      />
    </Table>
  );
}
