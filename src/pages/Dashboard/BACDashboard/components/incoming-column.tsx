/* eslint-disable react-hooks/rules-of-hooks */
import { ColumnDef } from "@tanstack/react-table";
import { purchaseRequestType } from "@/types/response/puchase-request";
import { DataTableColumnHeader } from "./data-table-column-header";
import { useNavigate } from "react-router-dom";
import { IncomingDataTableRowActions } from "./incoming-row-actions";
import { formatDate } from "@/services/formatDate";

export const incoming_columns: ColumnDef<purchaseRequestType>[] = [
  {
    accessorKey: "pr_no",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="PR No." />
    ),
    cell: ({ row }) => {
      const navigate = useNavigate();
      const pr_no = row.getValue("pr_no");
      return (
        <div className="flex space-x-2 items-center">
          <span
            className="max-w-[500px] truncate font-medium hover:underline"
            onClick={() => navigate(`/bac/purchase-request/${pr_no}`)}
          >
            {row.getValue("pr_no")}
          </span>
        </div>
      );
    },
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
            {row.getValue("purpose")}
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
            {row.getValue("name")}
          </span>
        </div>
      );
    },
  },
  {
    accessorKey: "updated_at",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Date Forwarded" />
    ),
    cell: ({ row }) => {
      return (
        <div className="flex space-x-2">
          <span className="max-w-[500px] truncate font-medium">
            {formatDate(row.getValue("updated_at"))}
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
      <IncomingDataTableRowActions pr_no={row.getValue("pr_no")} />
    ),
  },
];
