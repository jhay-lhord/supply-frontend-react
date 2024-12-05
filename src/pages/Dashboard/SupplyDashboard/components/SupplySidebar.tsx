import {
  LayoutDashboard,
  FileText,
  ShoppingCart,
  FileSpreadsheet,
  FileSymlink,
} from "lucide-react";

import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from "@/components/ui/sidebar";
import Logo from "/public/CTU_new_logotransparent.svg";
import { CustomSidebarFooter } from "../../shared/components/SidebarFooter";

const dashboard = [
  {
    title: "Dashboard",
    url: "/",
    icon: LayoutDashboard,
  },
];

const procurement = [
  {
    title: "Purchase Request",
    url: "/supply/purchase-request",
    icon: FileText,
  },
  {
    title: "Purchase Order",
    url: "/supply/purchase-order",
    icon: ShoppingCart,
  },
];

const inventory = [
  {
    title: "Manage Inventory",
    url: "/supply/inventory",
    icon: FileSymlink,
  },
  {
    title: "Reports",
    url: "/supply/reports",
    icon: FileSpreadsheet,
  },
];

const SupplySidebar = () => {
  const { open } = useSidebar();

  return (
    <Sidebar collapsible="icon">
      <SidebarHeader className="flex flex-row items-center">
        {open ? (
          <div className="flex gap-2 items-center rounded-md shadow-sm p-2 w-full">
            <img src={Logo} alt="Logo" width={50} height={50} />
            <div>
              <p className="text-xl">CTU-AC</p>
              <p className="text-xs text-orange-400">
                SUPPLY MANAGEMENT SYSTEM
              </p>
            </div>
          </div>
        ) : (
          <img src={Logo} alt="Logo" width={50} height={50} />
        )}
      </SidebarHeader>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupContent>
            <SidebarGroupLabel>Analytics</SidebarGroupLabel>
            <SidebarMenu>
              {dashboard.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild className="px-4 py-6" isActive={location.pathname === item.url}>
                    <a href={item.url}>
                      <item.icon />
                      <p>{item.title}</p>
                    </a>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
            <SidebarGroupLabel>Procurement</SidebarGroupLabel>
            <SidebarMenu>
              {procurement.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild className="px-4 py-6" isActive={location.pathname === item.url}>
                    <a href={item.url}>
                      <item.icon />
                      <p>{item.title}</p>
                    </a>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
            <SidebarGroupLabel>Inventory</SidebarGroupLabel>
            <SidebarMenu>
              {inventory.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild className="px-4 py-6" isActive={location.pathname === item.url}>
                    <a href={item.url}>
                      <item.icon />
                      <p>{item.title}</p>
                    </a>
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

export default SupplySidebar;
