import { useAuth } from "@/hooks/useAuth";
import BACDashboard from "@/pages/Dashboard/BACDashboard/BACDashboard";
import SupplyDashboard from "@/pages/Dashboard/SupplyDashboard/Dashboard";
import BudgetDashboard from "@/pages/Dashboard/BudgetDashboard/BudgetDashboard";

const RoleBaseRouting = () => {
  const { role } = useAuth();

  if (!role) {
    return <div> Loading...</div>;
  }

  switch (role) {
    case "Supply Officer":
      return <SupplyDashboard />;
    case "Budget Officer":
      return <BudgetDashboard />;
    case "BAC Officer":
      return <BACDashboard />;
    default:
      return <div>Access Denied</div>
  }
};

export default RoleBaseRouting;
