import {
  LayoutDashboard,
  FileSpreadsheet,
  FileSymlink,
  FileCheck,
} from "lucide-react";
import { TooltipProvider } from "@radix-ui/react-tooltip";
import { SideNav } from "@/pages/Dashboard/shared/components/SideNav";

const BudgetSidebar = () => {
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
                title: "Budget",
                label: "",
                link_to: "/budget",
                icon: FileSpreadsheet,
                variant: "default",
              },
              {
                title: "Reports",
                label: "",
                link_to: "/budget-reports",
                icon: FileCheck,
                variant: "default",
              },
              {
                title: "Transaction",
                label: "",
                link_to: "/budget-transaction",
                icon: FileSymlink,
                variant: "default",
              },
            ]}
          />
        </aside>
      </TooltipProvider>
  )
}

export default BudgetSidebar