import { ColumnDef } from "@tanstack/react-table";
import { DataTableColumnHeader } from "./data-table-column-header";
import { DataTableRowActions } from "./data-table-row-actions";
import { UsersType } from "@/types/response/users";


export const columns: ColumnDef<UsersType>[] = [
  {
    accessorKey: "employee_id",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Employee No." />
    ),
    cell: ({ row }) => {
      return (
        <div className="flex space-x-2">
          <span className="max-w-[500px] truncate font-medium">
            {row.getValue("employee_id")}
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
      const firstName = row.original.first_name;
      const lastName = row.original.last_name;

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
    accessorKey: "last_login",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Last Login" />
    ),
    cell: ({ row }) => {
      const lastLogin = row.getValue("last_login");
      const lastLoginNum = new Date(
        row.getValue("last_login") as string | number
      );
      const now = new Date();

      const diffInSeconds = Math.floor(
        (now.getTime() - lastLoginNum.getTime()) / 1000
      );

      let timeAgo = "";
      console.log(row.getValue("last_login"));
      if (lastLogin === null || lastLogin === undefined) return (timeAgo = "");

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
          <span className="max-w-[500px] truncate font-medium">{timeAgo}</span>
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
      <DataTableRowActions id={row.getValue("id")} _data={row.original} />
    ),
  },
];
