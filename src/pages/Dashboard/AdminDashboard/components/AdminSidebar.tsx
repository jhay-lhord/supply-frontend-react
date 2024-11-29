import { User2Icon, LayoutDashboard, Users} from "lucide-react";
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
              link_to: "/admin/dashboard",
              icon: LayoutDashboard,
              variant: "default",
            },
            {
              title: "Users",
              label: "",
              link_to: "/admin/users",
              icon: Users,
              variant: "default",
            },
            {
              title: "Requisitioner",
              label: "",
              link_to: "/admin/requisitioner",
              icon: Users,
              variant: "default",
            },
            {
              title: "Campus Director",
              label: "",
              link_to: "/admin/campus-director",
              icon: User2Icon,
              variant: "default",
            },
            {
              title: "BAC Members",
              label: "",
              link_to: "/admin/BACmembers",
              icon: Users,
              variant: "default",
            },
          ]}
        />
      </aside>
    </TooltipProvider>
  );
};

export default AdminSidebar;
