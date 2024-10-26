import DashboardLayout from "@/pages/Dashboard/shared/Layouts/DashboardLayout";
import SupplySidebar from "./components/SupplySidebar";
import PurchaseRequestInProgressDataTable from "./components/PurchaseRequestInProgressDataTable";

const PurchaseRequestInProgress: React.FC = () => {
  return (
    <DashboardLayout>
      <SupplySidebar />
      <div className="pt-16 w-full">
        <PurchaseRequestInProgressDataTable />
      </div>
    </DashboardLayout>
  );
};

export default PurchaseRequestInProgress;
