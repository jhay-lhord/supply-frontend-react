import { TooltipProvider } from "@radix-ui/react-tooltip";
import {
  LayoutDashboard,
  FileText,
  ShoppingCart,
  FileSpreadsheet,
  FileSymlink,
} from "lucide-react";
import DashboardLayout from "@/pages/Dashboard/shared/Layouts/DashboardLayout";
import { SideNav } from "@/pages/Dashboard/shared/components/SideNav";

const PurchaseRequest: React.FC = () => {
  return (
    <DashboardLayout>
      <TooltipProvider>
        <aside className="hidden md:flex flex-col w-auto h-screen p-2 border-r border-gray-200 sticky top-0 pt-16">
          <SideNav
            isCollapsed={false}
            links={[
              {
                title: "Dashboard",
                label: "",
                link_to: "/dashboard",
                icon: LayoutDashboard,
                variant: "default",
              },
              {
                title: "Purchase Request",
                label: "",
                link_to: "/purchase-request",
                icon: FileText,
                variant: "default",
              },
              {
                title: "Purchase Order",
                label: "",
                link_to: "/purchase-order",
                icon: ShoppingCart,
                variant: "default",
              },
              {
                title: "Reports",
                label: "",
                link_to: "/reports",
                icon: FileSpreadsheet,
                variant: "default",
              },
              {
                title: "Transaction",
                label: "",
                link_to: "/transaction",
                icon: FileSymlink,
                variant: "default",
              },
            ]}
          />
        </aside>
      </TooltipProvider>
      {/* Main Content */}
      <h1 className="pt-20 p-4  text-3xl font-bold tracking-tight">Purchase Request</h1>
    </DashboardLayout>
  );
};

export default PurchaseRequest;