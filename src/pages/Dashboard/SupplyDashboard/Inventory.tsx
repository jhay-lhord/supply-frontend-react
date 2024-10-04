import DashboardLayout from "@/pages/Dashboard/shared/Layouts/DashboardLayout";
import SupplySidebar from "./components/SupplySidebar";


const Inventory: React.FC = () => {
  return (
    <DashboardLayout>
      <SupplySidebar />
      <h1 className="pt-16 text-3xl">Inventory</h1>
    </DashboardLayout>
  );
};

export default Inventory;
