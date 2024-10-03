import { UserNav } from "@/pages/Dashboard/shared/components/UserNav";

interface DashboardLayoutProps {
  children: React.ReactNode;
}

const SupplyDashboardLayout: React.FC<DashboardLayoutProps> = ({
  children,
}) => {
  return (
    <div className="flex flex-col min-h-screen">
      {/* Top Navigation */}
      <header className="fixed top-0 right-0 left-0 z-10 shadow bg-white">
        <div className="flex h-16 items-center px-4">
          <h2>LOGO</h2>
          <div className="ml-auto flex items-center space-x-4">
            <UserNav />
          </div>
        </div>
      </header>

      <div className="flex">{children}</div>
    </div>
  );
};

export default SupplyDashboardLayout;
