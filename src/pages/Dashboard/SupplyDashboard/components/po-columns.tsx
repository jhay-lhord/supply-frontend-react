import { ColumnDef } from "@tanstack/react-table";
import { Checkbox } from "@/components/ui/checkbox";
import { DataTableColumnHeader } from "../components/data-table-column-header";
import { DataTableRowActions } from "../components/data-table-row-actions";
import { abstractType_ } from "@/types/response/abstract-of-quotation";
export const po_columns: ColumnDef<abstractType_>[] = [
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
    accessorKey: "pr_details.pr_no",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="PR No." />
    ),
    cell: ({ row }) => {
      const prNo = row.original.pr_details?.pr_no;
      console.log(prNo)
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
    accessorKey: "afq_no",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="AOQ No." />
    ),
    cell: ({ row }) => {
      return (
        <div className="flex space-x-2">
          <span className="max-w-[500px] truncate font-medium">
            {row.getValue("afq_no")}
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
            {/* {row.getValue("afq_no")} */}
            4 Items
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
      <DataTableRowActions pr_no={row.original.pr_details.pr_no} _data={row.original} />
    ),
  },
];
