import { useGetUsers } from "@/services/userServices";
import { columns } from "./columns";
import { DataTable } from "./data-table";
import { UsersType } from "@/types/response/users";

export default function UsersDataTable() {
  const { isLoading, error, data } = useGetUsers()

  console.log(data)

  if (isLoading) return <div>Loading...</div>;

  if (error) return <div>{error.message}</div>
  const usersData: UsersType[] =
    data?.status === "success" ? data.data || [] : [];



  return (
    <>
      <div className="hidden w-full flex-col space-y-8 p-8 md:flex">
        <DataTable data={usersData} columns={columns} />
      </div>
    </>
  );
}
