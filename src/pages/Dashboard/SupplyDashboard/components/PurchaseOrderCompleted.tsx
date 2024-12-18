import { Badge } from "@/components/ui/badge";
import { PackageOpen } from "lucide-react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { formatDate } from "@/utils/formateDate";
import { useGetAllPurchaseOrder } from "@/services/puchaseOrderServices";
import Loading from "../../shared/components/Loading";
import { useGetAllSupplierItem } from "@/services/AbstractOfQuotationServices";

export default function PurchaseOrderCompleted() {

  const { data, isLoading } = useGetAllPurchaseOrder();
  const { data: supplier_item } = useGetAllSupplierItem();

  const purchaseOrderData = Array.isArray(data?.data) ? data.data : [];
  const completedOrders = purchaseOrderData.filter(
    (order) => order.status === "Completed"
  );

  const supplierItemData = Array.isArray(supplier_item?.data)
  ? supplier_item.data
  : [];

  const itemsInSupplierCount = (supplier_no: string) =>
    supplierItemData.filter(
      (data) => data.supplier_details.supplier_no === supplier_no
    ).length;

  if (isLoading) return <Loading />;


  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>PO Number</TableHead>
          <TableHead>AOQ No</TableHead>
          <TableHead>Items</TableHead>
          <TableHead>Total Amount</TableHead>
          <TableHead>Status</TableHead>
          <TableHead>Updated At</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {completedOrders.length > 0 ? (
          completedOrders.map((order) => (
            <TableRow key={order.po_no}>
              <TableCell className="font-medium">{order.po_no}</TableCell>
              <TableCell>{order.aoq_details.aoq_no}</TableCell>
              <TableCell>{itemsInSupplierCount(order.supplier_details.supplier_no)}</TableCell>
              <TableCell>₱{Number(order.total_amount).toFixed(2)}</TableCell>
              <TableCell>
                <Badge variant="outline" className="capitalize">
                  {order.status}
                </Badge>
              </TableCell>
              <TableCell>{formatDate(order.updated_at)}</TableCell>
            </TableRow>
          ))
        ) : (
          <TableRow>
            <TableCell colSpan={7} className="h-24 text-center">
              <div className="flex flex-col items-center justify-center space-y-3">
                <PackageOpen className="h-8 w-8 text-gray-400" />
                <div className="text-lg font-medium text-gray-900">
                  No Orders Completed
                </div>
                <div className="text-sm text-gray-500">
                  There are currently no orders completed.
                </div>
              </div>
            </TableCell>
          </TableRow>
        )}
      </TableBody>
    </Table>
  );
}
