import { ColumnDef } from "@tanstack/react-table";
import { Checkbox } from "@/components/ui/checkbox";
import { DataTableColumnHeader } from "../components/data-table-column-header";
import { DataTableRowActions } from "../components/data-table-row-actions";
import { UsersType } from "@/types/response/users";

//Step 4: define the columns

export const columns: ColumnDef<UsersType>[] = [
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
    accessorKey: "id",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Id" />
    ),
    cell: ({ row }) => {
      return (
        <div className="flex space-x-2">
          <span className="max-w-[500px] truncate font-medium">
            {row.getValue("id")}
          </span>
        </div>
      );
    },
  },
  {
    accessorKey: "full_name",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Full Name" />
    ),
    cell: ({ row }) => {
      const firstName = row.original.first_name
      const lastName = row.original.last_name
  
      return (
        <div className="flex space-x-2">
          <span className="max-w-[500px] truncate font-medium">
            {`${firstName} ${lastName}`}
          </span>
        </div>
      );
    },
  },
  
  {
    accessorKey: "email",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Email" />
    ),
    cell: ({ row }) => {
      return (
        <div className="flex space-x-2">
          <span className="max-w-[500px] truncate font-medium">
            {row.getValue("email")}
          </span>
        </div>
      );
    },
  },
  {
    accessorKey: "role",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Role" />
    ),
    cell: ({ row }) => {
      return (
        <div className="flex space-x-2">
          <span className="max-w-[500px] truncate font-medium">
            {row.getValue("role")}
          </span>
        </div>
      );
    },
  },

  {
    accessorKey: "date_joined",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Date Joined" />
    ),
    cell: ({ row }) => {
      const dateJoined = row.getValue("date_joined") as string | number;
      const formattedDate = new Date(dateJoined).toLocaleDateString("en-US", {
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
    accessorKey: "last_login",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Last Login" />
    ),
    cell: ({ row }) => {
      const lastLogin = new Date(row.getValue("last_login") as string | number);
      const now = new Date();
  
      const diffInSeconds = Math.floor((now.getTime() - lastLogin.getTime()) / 1000);
  
      let timeAgo = "";
      if (diffInSeconds < 60) {
        timeAgo = `${diffInSeconds} seconds ago`;
      } else if (diffInSeconds < 3600) {
        const minutes = Math.floor(diffInSeconds / 60);
        timeAgo = `${minutes} minutes ago`;
      } else if (diffInSeconds < 86400) {
        const hours = Math.floor(diffInSeconds / 3600);
        timeAgo = `${hours} hours ago`;
      } else {
        const days = Math.floor(diffInSeconds / 86400);
        timeAgo = `${days} days ago`;
      }
  
      return (
        <div className="flex space-x-2">
          <span className="max-w-[500px] truncate font-medium">
            {timeAgo}
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
      <DataTableRowActions id={row.getValue("id")} _data={row.original} />
    ),
  },
];
