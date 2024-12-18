import { ColumnDef } from "@tanstack/react-table";
import { DataTableColumnHeader } from "./data-table-column-header";
import { DataTableRowActions } from "./data-table-row-actions";
import { abstractType_ } from "@/types/response/abstract-of-quotation";

export const abstract_columns: ColumnDef<abstractType_>[] = [
  {
    accessorKey: "pr_details.pr_no",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="PR No." />
    ),
    cell: ({ row }) => {
      return (
        <div className="flex space-x-2">
          <span className="max-w-[500px] truncate font-medium">
            {row.original.pr_details?.pr_no}
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
      return (
        <div className="flex space-x-2">
          <span className="max-w-[500px] truncate font-medium">
            {row.getValue("aoq_no")}
          </span>
        </div>
      );
    },
  },
  {
    accessorKey: "afq_no",
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
      <DataTableRowActions
        pr_no={row.original.pr_details.pr_no}
        _data={row.original}
      />
    ),
  },
];
