import {
  LayoutDashboard,
  Users,
  User2Icon,
} from "lucide-react";

import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from "@/components/ui/sidebar";
import { CustomSidebarFooter } from "../../shared/components/SidebarFooter";
import { Link } from "react-router-dom";


const AdminNav = [
  {
    title: "Dashboard",
    url: "/admin/dashboard",
    icon: LayoutDashboard,
   
  },
  {
    title: "Users",
    url: "/admin/users",
    icon: Users,
    
  },
  {
    title: "Requisitioner",
    url: "/admin/requisitioner",
    icon: Users,
   
  },
  {
    title: "Campus Director",
    url: "/admin/campus-director",
    icon: User2Icon,
   
  },
  {
    title: "BAC Members",
    url: "/admin/BACmembers",
    icon: Users,
    
  },
];



const AdminSidebar = () => {
  const { open } = useSidebar();

  return (
    <Sidebar collapsible="icon">
      <SidebarHeader className="flex flex-row items-center">
        {open ? (
          <div className="flex gap-2 items-center rounded-md shadow-sm p-2 w-full">
            <img src="/CTU_new_logotransparent.svg" alt="Logo" width={50} height={50} />
            <div>
              <p className="text-xl">CTU-AC</p>
              <p className="text-xs text-orange-400">
                SUPPLY MANAGEMENT SYSTEM
              </p>
            </div>
          </div>
        ) : (
          <img src="/CTU_new_logotransparent.svg" alt="Logo" width={50} height={50} />
        )}
      </SidebarHeader>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupContent>
       
            <SidebarMenu>
              {AdminNav.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild className="px-4 py-6" isActive={location.pathname === item.url}>
                    <Link to={item.url}>
                      <item.icon />
                      <p>{item.title}</p>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
      <SidebarFooter>
        <CustomSidebarFooter />
      </SidebarFooter>
    </Sidebar>
  );
};

export default AdminSidebar;
