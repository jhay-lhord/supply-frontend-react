import { Loader2, Package } from "lucide-react";
import Layout from "./components/Layout/SupplyDashboardLayout";
import { useGetItemsDelivered } from "@/services/puchaseOrderServices";
import { DataTable } from "./components/data-table";
import { inventoryColumns } from "./components/inventory-column";

export default function ModernInventory() {
  const { data: items_delivered, isLoading: itemsLoading } =
    useGetItemsDelivered();

  const itemDeliveredData = Array.isArray(items_delivered?.data)
    ? items_delivered.data
    : [];

  const flattenedItemDeliveredData = itemDeliveredData.map((item) => ({
    ...item,
    po_no: item.inspection_details.po_details.po_no,
    item_description:
      item.item_details.item_quotation_details.item_details.item_description,
    unit: item.item_details.item_quotation_details.item_details.unit,
    quantity: item.item_details.item_quotation_details.item_details.quantity,
    unit_cost: item.item_details.item_quotation_details.item_details.unit_cost,
  }));

  console.log(itemDeliveredData);

  return (
    <Layout>
      <div className="w-full">
        <h1 className="text-3xl font-bold mb-6 flex items-center">
          <Package className="mr-2" />
          Inventory Management
        </h1>

        <div className="rounded-md">
          {itemsLoading ? (
            <Loader2 className="animate-spin" />
          ) : (
            <DataTable
              data={flattenedItemDeliveredData}
              columns={inventoryColumns}
            />
          )}
        </div>
      </div>
    </Layout>
  );
}
