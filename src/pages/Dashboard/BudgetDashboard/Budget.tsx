import DashboardLayout from "@/pages/Dashboard/shared/Layouts/DashboardLayout";
import BudgetSidebar from "./components/BudgetSidebar";
import BudgetDataTable from "./components/BudgetDataTable";


const Budget: React.FC = () => {
  return (
    <DashboardLayout>
      <BudgetSidebar />
      <div className="pt-16 w-full">
        <BudgetDataTable />
      </div>
    </DashboardLayout>
  );
};

export default Budget;
