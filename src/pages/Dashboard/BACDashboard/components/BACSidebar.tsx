import {
  LayoutDashboard,
  FileText,

  FileCheck,
  FileSpreadsheet,
  FileSymlink,
} from "lucide-react";
import { TooltipProvider } from "@radix-ui/react-tooltip";
import { SideNav } from "@/pages/Dashboard/shared/components/SideNav";

const BACSidebar = () => {
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
            title: "Request For Quotation",
            label: "",
            link_to: "/bac/purchase-request",
            icon: FileText,
            variant: "default",
          },
          {
            title: "Abstract Of Quotation",
            label: "",
            link_to: "/bac/abstract-of-quotation",
            icon: FileText,
            variant: "default",
          },
          {
            title: "Reports",
            label: "",
            link_to: "/bac/bac-reports",
            icon: FileSpreadsheet,
            variant: "default",
          },
          {
            title: "Transaction",
            label: "",
            link_to: "/bac/bac-transaction",
            icon: FileSymlink,
            variant: "default",
          },
        
        ]}
      />
    </aside>
  </TooltipProvider>
  )
}

export default BACSidebar