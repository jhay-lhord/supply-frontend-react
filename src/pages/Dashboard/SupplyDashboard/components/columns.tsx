import { ColumnDef } from "@tanstack/react-table";
import { purchaseRequestType } from "@/types/response/puchase-request";
import { DataTableColumnHeader } from "./data-table-column-header";
import { DataTableRowActions } from "./data-table-row-actions";
import { Badge } from "@/components/ui/badge";
import { FilteredItemInPurchaseRequest } from "@/services/itemServices";

export const columns: ColumnDef<purchaseRequestType>[] = [
  {
    accessorKey: "pr_no",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="PR No." />
    ),
    cell: ({ row }) => {
      const itemData = FilteredItemInPurchaseRequest(row.getValue("pr_no"));
      const itemCount = itemData?.length ?? 0;
      return (
        <div className="flex space-x-2">
          <span className="max-w-[300px] truncate font-medium">
            <div className="flex items-center">
              <p className="font-thin text-sm">{row.getValue("pr_no")}</p>
              <Badge
                className={`${
                  !itemCount && "bg-red-200"
                } m-2 p-2 w-6 h-6 flex items-center hover:bg-red-200 justify-center`}
              >
                {itemCount}
              </Badge>
            </div>
          </span>
        </div>
      );
    },
  },
  {
    accessorKey: "status",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="STATUS" />
    ),
    cell: ({ row }) => {
      const status = row.getValue("status");
      return (
        <div className="w-[250px]">
          <Badge
            className={`${
              status === "Approved"
                ? "bg-green-200 hover:bg-green-300 text-green-500"
                : status === "Cancelled"
                ? "bg-red-100 hover:bg-red-200 text-red-400"
                : "bg-orange-100 text-orange-400"
            }`}
          >
            {row.getValue("status")}
          </Badge>
        </div>
      );
    },
    enableSorting: false,
    enableHiding: false,
  },
  {
    accessorKey: "purpose",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Purpose" />
    ),
    cell: ({ row }) => {
      return (
        <div className="flex space-x-2">
          <span className="max-w-[500px] font-medium">
            <p className="font-thin text-sm">{row.getValue("purpose")}</p>
          </span>
        </div>
      );
    },
  },
  {
    accessorKey: "name",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Requested By" />
    ),
    cell: ({ row }) => {
      return (
        <div className="flex space-x-2">
          <span className="max-w-[500px] truncate font-medium">
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
      <DataTableRowActions pr_no={row.getValue("pr_no")} _data={row.original} />
    ),
  },
];
