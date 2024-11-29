import DashboardLayout from "@/pages/Dashboard/shared/Layouts/DashboardLayout";
import AdminSidebar from "./components/AdminSidebar";
import BACmemberForm from "./components/BACmemberForm";

const BACmember: React.FC = () => {
  return (
    <DashboardLayout>
      <AdminSidebar />
      <div className="pt-16 w-full">
        <BACmemberForm />
      </div>
    </DashboardLayout>
  );
};

export default BACmember;
