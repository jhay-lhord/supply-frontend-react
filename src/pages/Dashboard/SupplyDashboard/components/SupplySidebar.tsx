import {
  LayoutDashboard,
  FileText,
  ShoppingCart,
  FileSpreadsheet,
  FileSymlink,
  ChevronUp,
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
} from "@/components/ui/sidebar";
import Logo from "/public/CTU_new_logotransparent.svg";
import { UserNav } from "../../shared/components/UserNav";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Separator } from "@/components/ui/separator";
import { useNavigate } from "react-router-dom";
import { userEmail, userFullname } from "@/services/useProfile";

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
  const navigate = useNavigate();
  const handleLogoutClick = () => {
    localStorage.clear();
    navigate("/login");
  };

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
      <SidebarFooter>
        <SidebarMenu>
          <SidebarMenuItem>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <SidebarMenuButton className="">
                  <UserNav />
                  <div className="flex flex-col space-y-1">
                    <p className="text-sm">{userFullname}</p>
                    <p className="text-xs leading-none text-muted-foreground">
                      {userEmail}
                    </p>
                  </div>
                  <ChevronUp className="ml-auto" />
                </SidebarMenuButton>
              </DropdownMenuTrigger>
              <DropdownMenuContent
                side="top"
                className="w-[--radix-popper-anchor-width]"
              >
                <DropdownMenuItem>
                  <span>Account</span>
                </DropdownMenuItem>
                <Separator />
                <DropdownMenuItem onClick={handleLogoutClick}>
                  <span>Sign out</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
    </Sidebar>
  );
};

export default SupplySidebar;
