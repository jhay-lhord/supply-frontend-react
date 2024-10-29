import DashboardLayout from "@/pages/Dashboard/shared/Layouts/DashboardLayout";
import AdminSidebar from "./components/AdminSidebar";
import UsersDataTable from "./components/UsersDataTable";

const Users: React.FC = () => {
  return (
    <DashboardLayout>
      <AdminSidebar />
      <div className="pt-16 w-full">
        <UsersDataTable />
      </div>
    </DashboardLayout>
  );
};

export default Users;
