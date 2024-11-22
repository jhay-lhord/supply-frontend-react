import { User2Icon, LayoutDashboard } from "lucide-react";
import { TooltipProvider } from "@radix-ui/react-tooltip";
import { SideNav } from "@/pages/Dashboard/shared/components/SideNav";

const AdminSidebar = () => {
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
              title: "Users",
              label: "",
              link_to: "/admin/users",
              icon: User2Icon,
              variant: "default",
            },
            {
              title: "Requisitioner",
              label: "",
              link_to: "/admin/users",
              icon: User2Icon,
              variant: "default",
            },
            {
              title: "Campus Director",
              label: "",
              link_to: "/admin/users",
              icon: User2Icon,
              variant: "default",
            },
          ]}
        />
      </aside>
    </TooltipProvider>
  );
};

export default AdminSidebar;
