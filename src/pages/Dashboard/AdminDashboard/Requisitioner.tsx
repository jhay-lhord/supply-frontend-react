import DashboardLayout from "@/pages/Dashboard/shared/Layouts/DashboardLayout";
import AdminSidebar from "./components/AdminSidebar";
import RequisitionerForm from "./components/requisitionerForm";

const Requisitioner: React.FC = () => {
  return (
    <DashboardLayout>
      <AdminSidebar />
      <div className="pt-16 w-full">
        <RequisitionerForm />
      </div>
    </DashboardLayout>
  );
};

export default Requisitioner;
