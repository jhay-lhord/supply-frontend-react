import { ColumnDef } from "@tanstack/react-table";
import { DataTableColumnHeader } from "../components/data-table-column-header";
import { CampusDirectorType } from "@/types/request/campus-director";
import { CDDataTableRowActions } from "./campusDirectorActions";

//Step 4: define the columns

export const campusdirector_columns: ColumnDef<CampusDirectorType>[] = [
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
      <CDDataTableRowActions id={row.original.cd_id} _data={row.original} />
    ),
  },
];
