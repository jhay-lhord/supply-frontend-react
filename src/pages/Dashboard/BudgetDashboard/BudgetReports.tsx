import DashboardLayout from "@/pages/Dashboard/shared/Layouts/DashboardLayout";
import BudgetSidebar from "./components/BudgetSidebar";


const BudgetReports: React.FC = () => {
  return (
    <DashboardLayout>
      <BudgetSidebar />
      <h1 className="pt-16 text-3xl">Budget Reports
      </h1>
    </DashboardLayout>
  );
};

export default BudgetReports;
