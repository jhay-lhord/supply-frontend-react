import { ColumnDef } from "@tanstack/react-table";
import { DataTableColumnHeader } from "./data-table-column-header";
import { purchaseOrdertype_ } from "@/types/response/purchase-order";
import { PORowActions } from "./poAction";

export const po_columns: ColumnDef<purchaseOrdertype_>[] = [
  {
    accessorKey: "po_no",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="PO No." />
    ),
    cell: ({ row }) => {
      return (
        <div className="flex space-x-2">
          <span className="max-w-[500px] truncate font-medium">
            {row.getValue("po_no")}
          </span>
        </div>
      );
    },
  },
  {
    accessorKey: "aoq_no",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="AOQ No." />
    ),
    cell: ({ row }) => {
      const aoqNo = row.original.aoq_details?.aoq_no
      return (
        <div className="flex space-x-2">
          <span className="max-w-[500px] truncate font-medium">
            {aoqNo  }
          </span>
        </div>
      );
    },
  },
  {
    accessorKey: "afq_details.afq_no",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Items" />
    ),
    cell: ({ row }) => {
      return (
        <div className="flex space-x-2">
          <span className="max-w-[500px] truncate font-medium hover:underline">
            {row.getValue("afq_no")}
          </span>
        </div>
      );
    },
  },

  {
    accessorKey: "created_at",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Created At" />
    ),
    cell: ({ row }) => {
      const createdAt = row.getValue("created_at") as string | number;
      const formattedDate = new Date(createdAt).toLocaleDateString("en-US", {
        year: "numeric",
        month: "short",
        day: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      });
      return (
        <div className="flex space-x-2">
          <span className="max-w-[500px] truncate font-medium">
            {formattedDate}
          </span>
        </div>
      );
    },
  },
  {
    id: "actions",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Actions" />
    ),
    cell: ({ row }) => (
      <PORowActions po_no={row.getValue("po_no")}/>
    ),
  },
];
