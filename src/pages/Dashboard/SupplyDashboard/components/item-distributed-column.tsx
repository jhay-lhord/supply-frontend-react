/* eslint-disable react-hooks/rules-of-hooks */
import { ColumnDef } from "@tanstack/react-table";
import { DataTableColumnHeader } from "./data-table-column-header";
import { purchaseRequestType } from "@/types/response/puchase-request";
import { useGetAllSupplierItem } from "@/services/AbstractOfQuotationServices";
import { useMemo } from "react";
import { ItemDistributedActions } from "./item-distributed-action";

export const itemDistributedColumns: ColumnDef<purchaseRequestType>[] = [
  {
    accessorKey: "pr_no",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="PR No." />
    ),
    cell: ({ row }) => {
      return (
        <div className="flex space-x-2">
          <span className="max-w-[300px] truncate font-medium">
            <div className="flex items-center">
              <p className="font-thin text-sm">{row.getValue("pr_no")}</p>
            </div>
          </span>
        </div>
      );
    },
  },
  {
    accessorKey: "item_description",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="ITEMS" />
    ),
    cell: ({ row }) => {
      const { data: supplier_item } = useGetAllSupplierItem();

      const supplierItemData = useMemo(() => {
        return Array.isArray(supplier_item?.data) ? supplier_item.data : [];
      }, [supplier_item?.data]);

      const itemsInPurchaseRequest = (pr_no: string) => {
        return supplierItemData.filter(
          (data) => data.rfq_details.purchase_request === pr_no && data.supplier_details.aoq_details.pr_details.status === "Completed"
        ).length;
      };
      const itemsCount = itemsInPurchaseRequest(row.getValue("pr_no"));
      return (
        <div className="w-[200px]">{itemsCount}</div>
      );
    },
    enableSorting: false,
    enableHiding: false,
  },
  {
    accessorKey: "name",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="REQUESTED BY" />
    ),
    cell: ({ row }) => {
      return (
        <div className="flex space-x-2">
          <span className="max-w-[500px] font-medium">
            <p className="font-thin text-sm">{row.getValue("name")}</p>
          </span>
        </div>
      );
    },
  },
  {
    id: "actions",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="ACTIONS" />
    ),
    cell: ({ row }) => (
      <ItemDistributedActions
        pr_no={row.getValue("pr_no")}
        _data={row.original}
      />
    ),
  },
];
