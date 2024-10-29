import DashboardLayout from "@/pages/Dashboard/shared/Layouts/DashboardLayout";
import AdminSidebar from "./components/AdminSidebar";


const AdminDashboard: React.FC = () => {
  return (
    <DashboardLayout>
      <AdminSidebar />
      <h1 className="pt-16 text-3xl">Admin</h1>
    </DashboardLayout>
  );
};

export default AdminDashboard;
