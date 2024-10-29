import BACDashboard from "@/pages/Dashboard/BACDashboard/BACDashboard";
import SupplyDashboard from "@/pages/Dashboard/SupplyDashboard/Dashboard";
import AdminDashboard from "@/pages/Dashboard/AdminDashboard/Dashboard";
import { getRoleFromToken } from "@/utils/jwtHelper";
import { ACCESS_TOKEN } from "@/constants";

const RoleBaseRouting = () => {
  const access_token = localStorage.getItem(ACCESS_TOKEN)
  const role = getRoleFromToken(access_token!)

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
