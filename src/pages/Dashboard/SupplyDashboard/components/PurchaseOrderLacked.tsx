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
import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";

export default function PurchaseOrderLacked() {

  const { data, isLoading } = useGetAllPurchaseOrder();
  const navigate = useNavigate();

  const purchaseOrderData = Array.isArray(data?.data) ? data.data : [];
  const lackingOrders = purchaseOrderData.filter(
    (order) => order.status === "Lacking"
  );

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
          <TableHead>Action</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {lackingOrders.length > 0 ? (
          lackingOrders.map((order) => (
            <TableRow key={order.po_no}>
              <TableCell className="font-medium"><Link className="hover:underline" to={`/bac/purchase-order/${order.po_no}`}>{order.po_no}</Link></TableCell>
              <TableCell>{order.aoq_details.aoq_no}</TableCell>
              <TableCell>{4}</TableCell>
              <TableCell>₱{Number(order.total_amount).toFixed(2)}</TableCell>
              <TableCell>
                <Badge variant="outline" className="capitalize">
                  {order.status}
                </Badge>
              </TableCell>
              <TableCell>{formatDate(order.updated_at)}</TableCell>
              <TableCell><Button onClick={() => navigate(`/bac/purchase-order/${order.po_no}`)}>Open</Button></TableCell>
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
                  There are currently no orders lacking.
                </div>
              </div>
            </TableCell>
          </TableRow>
        )}
      </TableBody>
    </Table>
  );
}
