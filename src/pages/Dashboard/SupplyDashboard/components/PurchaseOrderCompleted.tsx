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

export default function PurchaseOrderCompleted() {

  const { data } = useGetAllPurchaseOrder();

  const purchaseOrderData = Array.isArray(data?.data) ? data.data : [];
  const completedOrders = purchaseOrderData.filter(
    (order) => order.status === "Completed"
  );

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>PO Number</TableHead>
          <TableHead>AOQ No</TableHead>
          <TableHead>Items</TableHead>
          <TableHead>Total Amount</TableHead>
          <TableHead>Status</TableHead>
          <TableHead>Created At</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {completedOrders.length > 0 ? (
          completedOrders.map((order) => (
            <TableRow key={order.po_no}>
              <TableCell className="font-medium">{order.po_no}</TableCell>
              <TableCell>{order.aoq_details.aoq_no}</TableCell>
              <TableCell>{4}</TableCell>
              <TableCell>php {Number(order.total_amount).toFixed(2)}</TableCell>
              <TableCell>
                <Badge variant="outline" className="capitalize">
                  {order.status}
                </Badge>
              </TableCell>
              <TableCell>{formatDate(order.created_at.toString())}</TableCell>
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
    </Table>
  );
}
