import {
  LayoutDashboard,
  FileText,
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

const purchase_request = [
  {
    title: "Approved PR",
    url: "/bac/purchase-request",
    icon: FileText,
  },
];

const quotation = [
  {
    title: "Request For Quotation",
    url: "/bac/purchase-request",
    icon: FileText,
  },
  {
    title: "Abstract Of Quotation",
    url: "/bac/abstract-of-quotation",
    icon: FileText,
  },
];

const BACSidebar = () => {
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
            <SidebarGroupLabel>Purchase Request</SidebarGroupLabel>
            <SidebarMenu>
              {purchase_request.map((item) => (
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
            <SidebarGroupLabel>Quotations</SidebarGroupLabel>
            <SidebarMenu>
              {quotation.map((item) => (
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

export default BACSidebar;
