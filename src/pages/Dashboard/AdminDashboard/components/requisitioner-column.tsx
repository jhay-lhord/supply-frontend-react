import { ColumnDef } from "@tanstack/react-table";
import { DataTableColumnHeader } from "../components/data-table-column-header";
import { DataTableRowActions } from "../components/data-table-row-actions";
import { RequisitionerType } from "@/types/request/requisitioner";

//Step 4: define the columns

export const requisitioner_columns: ColumnDef<RequisitionerType>[] = [
  {
    accessorKey: "name",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Full Name" />
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
    accessorKey: "gender",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Gender" />
    ),
    cell: ({ row }) => {
      return (
        <div className="flex space-x-2">
          <span className="max-w-[500px] truncate font-medium">
            {row.getValue("gender")}
          </span>
        </div>
      );
    },
  },
  {
    accessorKey: "department",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Department" />
    ),
    cell: ({ row }) => {
      return (
        <div className="flex space-x-2">
          <span className="max-w-[500px] truncate font-medium">
            {row.getValue("department")}
          </span>
        </div>
      );
    },
  },

  {
    accessorKey: "designation",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Designation" />
    ),
    cell: ({ row }) => {
     
  
      return (
        <div className="flex space-x-2">
          <span className="max-w-[500px] truncate font-medium">
          {row.getValue("designation")}
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
      <DataTableRowActions id={row.original.requisition_id} _data={row.original} />
    ),
  },
];
