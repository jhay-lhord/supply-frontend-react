import { Badge } from "@/components/ui/badge";
import {
  CheckCircle,
  EllipsisVerticalIcon,
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
import { useMemo, useState } from "react";
import {
  useGetAllPurchaseOrder,
  useGetItemsDelivered,
  useUpdatePurchaseOrderStatus,
} from "@/services/puchaseOrderServices";
import Loading from "../../shared/components/Loading";
import CancelOrderDialog from "./cancelOrder";
import { useNavigate } from "react-router-dom";
import { useUpdatePurchaseRequestStatus } from "@/services/purchaseRequestServices";

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
  const { data: items_delivered } = useGetItemsDelivered();
  const { mutate: updatePOMutation } = useUpdatePurchaseOrderStatus();
  const { mutate: updatePRMutation } = useUpdatePurchaseRequestStatus();
  const navigate = useNavigate();

  const itemsDeliveredData = useMemo(() => {
    return Array.isArray(items_delivered?.data) ? items_delivered?.data : [];
  }, [items_delivered?.data]);

  const purchaseOrderData = Array.isArray(data?.data) ? data.data : [];
  const inProgressOrders = purchaseOrderData.filter(
    (order) => order.status === "In Progress"
  );
  const supplierItemData = Array.isArray(supplier_item?.data)
    ? supplier_item.data
    : [];

  const getIncompleteItems = (supplier_no: string) => {
    return supplierItemData.filter((item) => {
      if (item.supplier_details.supplier_no !== supplier_no) {
        return false;
      }

      const deliveredItem = itemsDeliveredData.find(
        (delivered) =>
          delivered.item_details.supplier_item_no === item.supplier_item_no
      );

      if (!deliveredItem) {
        // If the item is not found in itemsDeliveredData, it's completely undelivered
        item.remaining_quantity = parseInt(
          item.item_quotation_details.item_details.quantity,
          10
        );
        return true;
      }

      const orderedQuantity = parseInt(
        item.item_quotation_details.item_details.quantity,
        10
      );
      const deliveredQuantity = Number(deliveredItem.quantity_delivered || 0);
      const remainingQuantity = orderedQuantity - deliveredQuantity;
      item.old_delivered_quantity = deliveredQuantity;

      if (remainingQuantity > 0) {
        item.remaining_quantity = remainingQuantity;
        return true;
      }

      return false;
    });
  };

  const isAllCompleted = useMemo(() => {
    inProgressOrders.forEach(order => {
      const incompleteItems = getIncompleteItems(order.supplier_details.supplier_no)
      console.log(incompleteItems)
      if (incompleteItems.length === 0) {
        updatePOMutation({ po_no: order.po_no, status: "Completed" });
        updatePRMutation({
          pr_no: order.pr_details.pr_no,
          status: "Items Delivered",
        });
        console.log('updated successfully')
      }
    })
  }, [inProgressOrders])

  console.log(isAllCompleted)


  // useEffect(() => {
  //   inProgressOrders.forEach((order) => {
  //     const incompleteItems = getIncompleteItems(
  //       order.supplier_details.supplier_no
  //     );
  //     if (incompleteItems.length === 0) {
  //       updatePOMutation({ po_no: order.po_no, status: "Completed" });
  //       updatePRMutation({
  //         pr_no: order.pr_details.pr_no,
  //         status: "Items Delivered",
  //       });
  //     }
  //   });
  // }, [
  //   inProgressOrders,
  //   supplierItemData,
  //   itemsDeliveredData,
  //   updatePOMutation,
  // ]);

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
              {/* <TableHead>Action</TableHead> */}
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
                            <EllipsisVerticalIcon className="h-5 w-5" />
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
        items_={getIncompleteItems(supplierNo)}
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
