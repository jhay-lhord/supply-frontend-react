/* eslint-disable react-hooks/rules-of-hooks */
import { ColumnDef } from "@tanstack/react-table";
import { purchaseRequestType } from "@/types/response/puchase-request";
import { DataTableColumnHeader } from "../components/data-table-column-header";
import { DataTableRowActions } from "../components/data-table-row-actions";
import { Badge } from "@/components/ui/badge";
import { useRequestForQoutationCount } from "@/services/requestForQoutationServices";
import { useNavigate } from "react-router-dom";
import { formatDate } from "@/services/formatDate";



export const AbstractColumn: ColumnDef<purchaseRequestType>[] = [
  {
    accessorKey: "pr_no",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="PO. No" />
    ),
    cell: ({ row }) => {
      const rfqCount = useRequestForQoutationCount(row.getValue("pr_no"))
      const navigate = useNavigate()
      const pr_no = row.getValue("pr_no")
      return (
        <div className="flex space-x-2 items-center">
          <span className="max-w-[500px] truncate font-medium hover:underline" onClick={()=> navigate(`/bac/abstract-of-quotation/${pr_no}`)}>
            {row.getValue("pr_no")}
          </span>
            <Badge className="m-2 p-2 w-6 h-6 flex items-center justify-center border-2  text-slate-950">{!rfqCount ? "0" : rfqCount}</Badge>
        </div>
      );
    },
  },
  {
    accessorKey: "status",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Status" />
    ),
    cell: ({ row }) => <div className="w-[80px]">{row.getValue("status")}</div>,
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
    accessorKey: "created_at",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Created At" />
    ),
    cell: ({ row }) => {
      return (
        <div className="flex space-x-2">
          <span className="max-w-[500px] truncate font-medium">
            {formatDate(row.getValue("created_at"))}
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
    cell: ({row}) => (
      <DataTableRowActions pr_no={row.getValue("pr_no")} _data={row.original} link={"abstract-of-quotation"} form="Abstract"/>
    ),
  },
];
