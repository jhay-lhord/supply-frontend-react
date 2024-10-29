import DashboardLayout from "@/pages/Dashboard/shared/Layouts/DashboardLayout";
import SupplySidebar from "./components/SupplySidebar";


const Reports: React.FC = () => {
  return (
    <DashboardLayout>
      <SupplySidebar />
      <h1 className="pt-16 text-3xl">Reports
      </h1>
    </DashboardLayout>
  );
};

export default Reports;
