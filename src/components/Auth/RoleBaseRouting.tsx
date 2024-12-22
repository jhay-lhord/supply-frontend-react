import BACDashboard from "@/pages/Dashboard/BACDashboard/BACDashboard";
import SupplyDashboard from "@/pages/Dashboard/SupplyDashboard/Dashboard";
import AdminDashboard from "@/pages/Dashboard/AdminDashboard/Dashboard";
import useAuthStore from "./authStore";

const RoleBaseRouting = () => {

  const { user } = useAuthStore();

  switch (user?.role) {
    case "Supply Officer":
      return <SupplyDashboard />;
    case "Admin":
      return <AdminDashboard />;
    case "BAC Officer":
      return <BACDashboard />;
    default:
      return <div>Access Denied</div>;
  }
};

export default RoleBaseRouting;
