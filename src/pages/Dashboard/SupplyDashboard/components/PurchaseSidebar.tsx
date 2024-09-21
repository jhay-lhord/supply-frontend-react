import {
  LayoutDashboard,
  FileText,
  ShoppingCart,
  FileSpreadsheet,
  FileSymlink,
} from "lucide-react";
import { TooltipProvider } from "@radix-ui/react-tooltip";
import { SideNav } from "@/pages/Dashboard/shared/components/SideNav";

const PurchaseSidebar = () => {
  return (
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
  )
}

export default PurchaseSidebar