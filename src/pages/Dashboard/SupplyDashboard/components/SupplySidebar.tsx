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
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
import Logo from "/public/CTU_new_logotransparent.svg";

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
  return (
    <Sidebar collapsible="icon">
      <SidebarHeader>
        <img
          src={Logo}
          alt="Logo"
          width={50}
          height={50}
          style={{ display: "block" }}
        />
      </SidebarHeader>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupContent>
            <SidebarGroupLabel>Analytics</SidebarGroupLabel>
            <SidebarMenu>
              {dashboard.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild className="px-4 py-6">
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
                  <SidebarMenuButton asChild className="px-4 py-6">
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
                  <SidebarMenuButton asChild className="px-4 py-6">
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
    </Sidebar>
  );
};

export default SupplySidebar;
