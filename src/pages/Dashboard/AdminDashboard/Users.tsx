import DashboardLayout from "@/pages/Dashboard/shared/Layouts/DashboardLayout";
import AdminSidebar from "./components/AdminSidebar";

const Users: React.FC = () => {
  return (
    <DashboardLayout>
      <AdminSidebar />
      <h1 className="pt-16 text-3xl">Users</h1>
    </DashboardLayout>
  );
};

export default Users;
