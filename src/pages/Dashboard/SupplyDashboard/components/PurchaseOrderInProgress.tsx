import { Badge } from "@/components/ui/badge";
import {
  CheckCircle,
  PackageOpen,
  XCircle,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { formatDate } from "@/utils/formateDate";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { OrderReceivedDialog } from "./orderReceived";
import { useGetAllSupplierItem } from "@/services/AbstractOfQuotationServices";
import { useState } from "react";
import { useGetAllPurchaseOrder } from "@/services/puchaseOrderServices";
import Loading from "../../shared/components/Loading";
import CancelOrderDialog from "./cancelOrder";
import { useNavigate } from "react-router-dom";

export default function PurchaseOrderInProgess() {
  const [poNo, setPoNo] = useState<string>("");
  const [supplierNo, setSupplierNo] = useState<string>("");
  const [isDialogOpen, setIsDialogOpen] = useState<boolean>(false);
  const [isCancelDialogOpen, setIsCancelDialogOpen] = useState<boolean>(false);
  const [openDropdowns, setOpenDropdowns] = useState<{
    [key: string]: boolean;
  }>({});

  const { data, isLoading } = useGetAllPurchaseOrder();
  const { data: supplier_item } = useGetAllSupplierItem();
  const navigate = useNavigate();

  const purchaseOrderData = Array.isArray(data?.data) ? data.data : [];
  const inProgressOrders = purchaseOrderData.filter(
    (order) => order.status === "In Progress"
  );
  const supplierItemData = Array.isArray(supplier_item?.data)
    ? supplier_item.data
    : [];

  const itemsInSupplierCount = (supplier_no: string) =>
    supplierItemData.filter(
      (data) => data.supplier_details.supplier_no === supplier_no
    ).length;

  const handleOpenOrderRecieveForm = (supplier_no: string, po_no: string) => {
    setIsDialogOpen(true);
    setSupplierNo(supplier_no);
    setOpenDropdowns({ [po_no]: false });
    setPoNo(po_no);
  };

  const handleCancelOrder = (po_no: string) => {
    setIsCancelDialogOpen(true);
    setPoNo(po_no);
  };

  const toggleDropdown = (poNo: string) => {
    setOpenDropdowns((prev) => ({
      ...prev,
      [poNo]: !prev[poNo],
    }));
  };

  if (isLoading) return <Loading />;

  return (
    <>
      <div>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>PO Number</TableHead>
              <TableHead>Items</TableHead>
              <TableHead>Total Amount</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Created At</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {inProgressOrders.length > 0 ? (
              inProgressOrders.map((order) => (
                <TableRow key={order.po_no}>
                  <TableCell
                    className="hover:underline hover:cursor-pointer"
                    onClick={() =>
                      navigate(`/bac/purchase-order/${order.po_no}`)
                    }
                  >
                    {order.po_no}
                  </TableCell>
                  <TableCell>
                    {itemsInSupplierCount(order.supplier_details.supplier_no)}
                  </TableCell>
                  <TableCell>
                    ₱{Number(order.total_amount).toFixed(2)}
                  </TableCell>
                  <TableCell>
                    <Badge variant="outline" className="capitalize">
                      {order.status}
                    </Badge>
                  </TableCell>
                  <TableCell>{formatDate(order.created_at)}</TableCell>
                  <TableCell>
                    <div className="flex justify-between items-center ">
                      <DropdownMenu
                        open={openDropdowns[order.po_no]}
                        onOpenChange={() => toggleDropdown(order.po_no)}
                      >
                        <DropdownMenuTrigger asChild>
                          <Button className="">
                            <p>Open Menu</p>
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent>
                          <DropdownMenuLabel>Actions</DropdownMenuLabel>
                          <DropdownMenuItem
                            onClick={() =>
                              handleOpenOrderRecieveForm(
                                order.supplier_details.supplier_no,
                                order.po_no
                              )
                            }
                            className="bg-green-200"
                          >
                            <CheckCircle className="mr-2 h-4 w-4" />
                            <span>Order Received</span>
                          </DropdownMenuItem>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem
                            onClick={() => handleCancelOrder(order.po_no)}
                            className="bg-red-200"
                          >
                            <XCircle className="mr-2 h-4 w-4" />
                            <span>Cancel Order</span>
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </div>
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
        </Table>
      </div>
      <OrderReceivedDialog
        po_no={poNo}
        supplier_no={supplierNo}
        items_={supplierItemData}
        isDialogOpen={isDialogOpen}
        setIsDialogOpen={setIsDialogOpen}
      />

      <CancelOrderDialog
        poNo={poNo}
        isCancelDialogOpen={isCancelDialogOpen}
        setIsCancelDialogOpen={setIsCancelDialogOpen}
      />
    </>
  );
}
