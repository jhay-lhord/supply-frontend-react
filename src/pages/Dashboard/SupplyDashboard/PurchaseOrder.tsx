import DashboardLayout from "@/pages/Dashboard/shared/Layouts/DashboardLayout";
import SupplySidebar from "./components/SupplySidebar";
import { useGetPurchaseOrder } from "@/services/puchaseOrderServices";
import PurchaseOrderDataTable from "./components/PurchaseOrderDataTable";

const PurchaseOrder: React.FC = () => {
  useGetPurchaseOrder();
  return (
    <DashboardLayout>
      <SupplySidebar />
      <div className="pt-16 w-full">
        <PurchaseOrderDataTable />
      </div>
    </DashboardLayout>
  );
};

export default PurchaseOrder;
