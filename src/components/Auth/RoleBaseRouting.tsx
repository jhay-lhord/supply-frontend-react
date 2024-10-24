import { useAuth } from "@/hooks/useAuth";
import BACDashboard from "@/pages/Dashboard/BACDashboard/BACDashboard";
import SupplyDashboard from "@/pages/Dashboard/SupplyDashboard/Dashboard";
import AdminDashboard from "@/pages/Dashboard/AdminDashboard/Dashboard";

const RoleBaseRouting = () => {
  const { role } = useAuth();

  if (!role) {
    return <div> Loading...</div>;
  }

  switch (role) {
    case "Supply Officer":
      return <SupplyDashboard />;
    case "Admin":
      return <AdminDashboard />;
    case "BAC Officer":
      return <BACDashboard />;
    default:
      return <div>Access Denied</div>
  }
};

export default RoleBaseRouting;
