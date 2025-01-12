import { useGetUsers } from "@/services/userServices";
import { columns } from "./columns";
import { DataTable } from "./data-table";
import { UsersType } from "@/types/response/users";
import Loading from "../../shared/components/Loading";

export default function UsersDataTable() {
  const { isLoading, error, data } = useGetUsers();

  console.log(data);

  if (isLoading) return <Loading />;

  if (error) return <div>{error.message}</div>;
  const usersData: UsersType[] =
    data?.status === "success" ? data.data || [] : [];

  const flattenedUserData = usersData.map((data) => ({
    ...data,
    fullname: `${data.first_name} ${data.last_name}`
  }))

  return (
    <>
      <div className="hidden flex-col md:flex">
        <p className="mx-6 my-4 text-xl">All Users</p>
        <DataTable data={flattenedUserData} columns={columns} />
      </div>
    </>
  );
}
