import { ColumnDef } from "@tanstack/react-table";
import { DataTableColumnHeader } from "../components/data-table-column-header";
import { _itemsDeliveredType } from "@/types/request/purchase-order";

export const inventoryColumns: ColumnDef<_itemsDeliveredType>[] = [
  {
    accessorKey: "po_no",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="PO No." />
    ),
    cell: ({ row }) => {
      return (
        <div className="flex space-x-2">
          <span className="max-w-[300px] truncate font-medium">
            <div className="flex items-center">
              <p className="font-thin text-sm">
                {row.getValue("po_no")}
              </p>
            </div>
          </span>
        </div>
      );
    },
  },
  {
    accessorKey: "item_description",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="ITEM" />
    ),
    cell: ({ row }) => {
      return (
        <div className="w-[200px]">
          {
            row.getValue("item_description")
          }
        </div>
      );
    },
    enableSorting: false,
    enableHiding: false,
  },
  {
    accessorKey: "unit",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="UNIT" />
    ),
    cell: ({ row }) => {
      return (
        <div className="flex space-x-2">
          <span className="max-w-[500px] font-medium">
            <p className="font-thin text-sm">
              {
                row.getValue("unit")
              }
            </p>
          </span>
        </div>
      );
    },
  },
  {
    accessorKey: "quantity",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="QUANTITY" />
    ),
    cell: ({ row }) => {
      return (
        <div className="flex space-x-2">
          <span className="max-w-[500px] truncate font-medium">
            <p className="font-thin text-sm">
              {
                row.getValue("quantity")
              }
            </p>
          </span>
        </div>
      );
    },
  },
  {
    accessorKey: "unit_cost",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="UNIT COST" />
    ),
    cell: ({ row }) => {
      return (
        <div className="flex space-x-2">
          <span className="max-w-[500px] truncate font-medium">
            <p className="font-thin text-sm">{row.getValue("unit_cost")}</p>

            {/* <p className="font-thin text-sm">
              {
                row.original.item_details.item_qoutation_details.item_details
                  .unit_cost
              }
            </p> */}
          </span>
        </div>
      );
    },
  },
  {
    accessorKey: "quantity_delivered",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="QUANTITY DELIVERED" />
    ),
    cell: ({ row }) => {
      console.log();
      return (
        <div className="flex space-x-2">
          <span className="max-w-[500px] truncate font-medium">
            <p className="font-thin text-sm">
              {row.getValue("quantity_delivered")}
            </p>
          </span>
        </div>
      );
    },
  },
];
