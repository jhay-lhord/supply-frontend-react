import DashboardLayout from "@/pages/Dashboard/shared/Layouts/DashboardLayout";
import PurchaseRequestDataTable from "./components/PurchaseRequestDataTable";
import SupplySidebar from "./components/SupplySidebar";


const PurchaseRequest: React.FC = () => {
  return (
    <DashboardLayout>
      <SupplySidebar />
      <div className="pt-16 w-full bg-slate-100">
        <PurchaseRequestDataTable />
      </div>
    </DashboardLayout>
  );
};

export default PurchaseRequest;
