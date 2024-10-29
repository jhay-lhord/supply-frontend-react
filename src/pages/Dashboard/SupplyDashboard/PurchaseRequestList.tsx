import DashboardLayout from "@/pages/Dashboard/shared/Layouts/DashboardLayout";
import SupplySidebar from "./components/SupplySidebar";
import PurchaseRequestItemList from "./components/PurchaseRequestItemList";

const PurchaseRequestList: React.FC = () => {
  return (
    <DashboardLayout>
      <SupplySidebar />
      <div className  ="pt-16 w-full">
        <PurchaseRequestItemList />
      </div>
    </DashboardLayout>
  );
};

export default PurchaseRequestList;
