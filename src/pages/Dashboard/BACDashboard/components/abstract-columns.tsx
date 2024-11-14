import { ColumnDef } from "@tanstack/react-table";
import { Checkbox } from "@/components/ui/checkbox";
import { purchaseRequestType } from "@/types/response/puchase-request";
import { DataTableColumnHeader } from "../components/data-table-column-header";
import { DataTableRowActions } from "../components/data-table-row-actions";
import { Badge } from "@/components/ui/badge";
import { useRequestForQoutationCount } from "@/services/requestForQoutationServices";
import { useNavigate } from "react-router-dom";



export const AbstractColumn: ColumnDef<purchaseRequestType>[] = [
  {
    id: "select",
    header: ({ table }) => (
      <Checkbox
        checked={
          table.getIsAllPageRowsSelected() ||
          (table.getIsSomePageRowsSelected() && "indeterminate")
        }
        onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
        aria-label="Select all"
        className="translate-y-[2px]"
      />
    ),
    cell: ({ row }) => (
      <Checkbox
        checked={row.getIsSelected()}
        onCheckedChange={(value) => row.toggleSelected(!!value)}
        aria-label="Select row"
        className="translate-y-[2px]"
      />
    ),
    enableSorting: false,
    enableHiding: false,
  },
  {
    accessorKey: "pr_no",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Purchase Number" />
    ),
    cell: ({ row }) => {
      // eslint-disable-next-line react-hooks/rules-of-hooks
      const rfqCount = useRequestForQoutationCount(row.getValue("pr_no"))
      // eslint-disable-next-line react-hooks/rules-of-hooks
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
    accessorKey: "requested_by",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Requested By" />
    ),
    cell: ({ row }) => {
      return (
        <div className="flex space-x-2">
          <span className="max-w-[500px] truncate font-medium">
            {row.getValue("requested_by")}
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
    cell: ({row}) => (
      <DataTableRowActions pr_no={row.getValue("pr_no")} _data={row.original} link={"abstract-of-quotation"} />
    ),
  },
];
