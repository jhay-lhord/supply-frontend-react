import DashboardLayout from "@/pages/Dashboard/shared/Layouts/DashboardLayout";
import BACSidebar from "./components/BACSidebar";
import PurchaseRequestItemList from "./components/PurchaseRequestItemList";

const BACPurchaseRequestList: React.FC = () => {
  return (
    <DashboardLayout>
      <BACSidebar />
      <div className  ="pt-16 w-full">
        <PurchaseRequestItemList />
      </div>
    </DashboardLayout>
  );
};

export default BACPurchaseRequestList;
