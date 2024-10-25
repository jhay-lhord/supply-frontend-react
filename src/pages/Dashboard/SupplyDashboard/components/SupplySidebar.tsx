import {
  LayoutDashboard,
  FileText,
  ShoppingCart,
  FileSpreadsheet,
  FileSymlink,
} from "lucide-react";
import { TooltipProvider } from "@radix-ui/react-tooltip";
import { SideNav } from "@/pages/Dashboard/shared/components/SideNav";

const SupplySidebar = () => {
  return (
    <TooltipProvider>
        <aside className="hidden md:flex flex-col w-auto h-screen p-2 border-r border-gray-200 sticky top-0 pt-16">
          <SideNav
            isCollapsed={false}
            links={[
              {
                title: "Dashboard",
                label: "",
                link_to: "/",
                icon: LayoutDashboard,
                variant: "default",
              },
              {
                title: "Purchase Request",
                label: "",
                link_to: "/supply/purchase-request",
                icon: FileText,
                variant: "default",
              },
              {
                title: "Purchase Order",
                label: "",
                link_to: "/supply/purchase-order",
                icon: ShoppingCart,
                variant: "default",
              },
              {
                title: "Reports",
                label: "",
                link_to: "/supply/reports",
                icon: FileSpreadsheet,
                variant: "default",
              },
              {
                title: "Inventory",
                label: "",
                link_to: "/supply/inventory",
                icon: FileSymlink,
                variant: "default",
              },
            ]}
          />
        </aside>
      </TooltipProvider>
  )
}

export default SupplySidebar