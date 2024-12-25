import React, { lazy, Suspense } from "react";
import useAuthStore from "./AuthStore";
import Loading from "@/pages/Dashboard/shared/components/Loading";

const BACDashboard = lazy(() => import("@/pages/Dashboard/BACDashboard/BACDashboard"));
const SupplyDashboard = lazy(() => import("@/pages/Dashboard/SupplyDashboard/Dashboard"));
const AdminDashboard = lazy(() => import("@/pages/Dashboard/AdminDashboard/Dashboard"));
const Login = lazy(() => import("@/pages/Forms/Login"));


const RoleBasedRouting: React.FC = () => {
  const { user, isLoading } = useAuthStore();

  const DashboardComponent = React.useMemo(() => {
    if (isLoading) return Loading;

    switch (user?.role) {
      case "Supply Officer":
        return SupplyDashboard;
      case "Admin":
        return AdminDashboard;
      case "BAC Officer":
        return BACDashboard;
      default:
        return Login;
    }
  }, [user?.role, isLoading]);

  return (
      <Suspense fallback={<Loading />}>
        <DashboardComponent />
      </Suspense>
  );
};

export default RoleBasedRouting;

