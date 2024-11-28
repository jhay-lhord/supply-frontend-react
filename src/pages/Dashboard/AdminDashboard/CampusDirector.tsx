import DashboardLayout from "@/pages/Dashboard/shared/Layouts/DashboardLayout";
import AdminSidebar from "./components/AdminSidebar";
import CampusDirectorForm from "./components/campusDirectorForm";

const CampusDirector: React.FC = () => {
  return (
    <DashboardLayout>
      <AdminSidebar />
      <div className="pt-16 w-full">
        <CampusDirectorForm />
      </div>
    </DashboardLayout>
  );
};

export default CampusDirector;
