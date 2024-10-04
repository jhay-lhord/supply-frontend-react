import DashboardLayout from "@/pages/Dashboard/shared/Layouts/DashboardLayout";
import BudgetSidebar from "./components/BudgetSidebar";


const BudgetTransaction: React.FC = () => {
  return (
    <DashboardLayout>
      <BudgetSidebar />
      <h1 className="pt-16 text-3xl">Budget Transactions
      </h1>
    </DashboardLayout>
  );
};

export default BudgetTransaction;
