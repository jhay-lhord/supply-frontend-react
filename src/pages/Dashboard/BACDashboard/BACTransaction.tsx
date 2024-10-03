import DashboardLayout from "@/pages/Dashboard/shared/Layouts/DashboardLayout";
import BACSidebar from "./components/BACSidebar";


const BACTransaction: React.FC = () => {
  return (
    <DashboardLayout>
      <BACSidebar />
      <h1 className="pt-16 text-3xl">BAC Transactions
      </h1>
    </DashboardLayout>
  );
};

export default BACTransaction;
