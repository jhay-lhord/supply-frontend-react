import DashboardLayout from "@/pages/Dashboard/shared/Layouts/DashboardLayout";
import BACSidebar from "./components/BACSidebar";
import PurchaseRequestInProgressDataTable from "./components/PurchaseRequestInProgressDataTable";

const BACPurchaseRequestInProgress: React.FC = () => {
  return (
    <DashboardLayout>
      <BACSidebar />
      <div className="pt-16 w-full">
        <PurchaseRequestInProgressDataTable />
      </div>
    </DashboardLayout>
  );
};

export default BACPurchaseRequestInProgress;
