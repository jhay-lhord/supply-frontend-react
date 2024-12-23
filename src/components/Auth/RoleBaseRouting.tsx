import React, { lazy, Suspense } from 'react';
import useAuthStore from './authStore';
import Loading from '@/pages/Dashboard/shared/components/Loading';

const BACDashboard = lazy(() => import("@/pages/Dashboard/BACDashboard/BACDashboard"));
const SupplyDashboard = lazy(() => import("@/pages/Dashboard/SupplyDashboard/Dashboard"));
const AdminDashboard = lazy(() => import("@/pages/Dashboard/AdminDashboard/Dashboard"));

const RoleBaseRouting: React.FC = () => {
  const { user } = useAuthStore();

  const DashboardComponent = React.useMemo(() => {
    switch (user?.role) {
      case "Supply Officer":
        return SupplyDashboard;
      case "Admin":
        return AdminDashboard;
      case "BAC Officer":
        return BACDashboard;
      default:
        return () => <div>Access Denied</div>;
    }
  }, [user?.role]);

  return (
    <Suspense fallback={<Loading />}>
      <DashboardComponent />
    </Suspense>
  );
};

export default RoleBaseRouting;

