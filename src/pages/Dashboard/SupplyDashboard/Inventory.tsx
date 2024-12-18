import {
  Package,
} from "lucide-react";
import Layout from "./components/Layout/SupplyDashboardLayout";
import { useGetAllPurchaseOrder, useGetItemsDelivered } from "@/services/puchaseOrderServices";
import { DataTable } from "./components/data-table";
import { inventoryColumns } from "./components/inventory-column";


export default function ModernInventory() {

  const { data } = useGetAllPurchaseOrder()
  const { data:items_delivered} = useGetItemsDelivered()

  console.log(data?.data)
  const itemDeliveredData = Array.isArray(items_delivered?.data) ? items_delivered.data : []

  const flattenedItemDeliveredData = itemDeliveredData.map(item => ({
    ...item,
    po_no: item.inspection_details.po_details.po_no,
    item_description: item.item_details.item_quotation_details.item_details.item_description,
    unit: item.item_details.item_quotation_details.item_details.unit,
    quantity: item.item_details.item_quotation_details.item_details.quantity,
    unit_cost: item.item_details.item_quotation_details.item_details.unit_cost,
  }));
  
  console.log(itemDeliveredData)


  return (
    <Layout>
      <div className="container mx-auto p-6">
        <h1 className="text-3xl font-bold mb-6 flex items-center">
          <Package className="mr-2" />
          Inventory Management
        </h1>

        {/* <div className="grid gap-6 mb-6 md:grid-cols-2 lg:grid-cols-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Total Orders
              </CardTitle>
              <ShoppingCart className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">0</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Order Completed
              </CardTitle>
              <Truck className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">0</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Order Cancelled
              </CardTitle>
              <BarChart2 className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                0
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Order with Lacking Items</CardTitle>
              <DollarSign className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">0</div>
            </CardContent>
          </Card>
        </div> */}

        <div className="rounded-md border">
          <DataTable data={flattenedItemDeliveredData} columns={inventoryColumns}/>
        </div>
      </div>
    </Layout>
  );
}
