import { ColumnDef } from "@tanstack/react-table";
import { DataTableColumnHeader } from "./data-table-column-header";
import { purchaseRequestType } from "@/types/response/puchase-request";
import { ItemDistributionActions } from "./item-distribution-action";

export const itemDistributionColumns: ColumnDef<purchaseRequestType>[] = [
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
      return (
        <div className="w-[200px]">{row.getValue("item_description")}</div>
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
      <ItemDistributionActions pr_no={row.getValue("pr_no")} _data={row.original} />
    ),
  },
];
