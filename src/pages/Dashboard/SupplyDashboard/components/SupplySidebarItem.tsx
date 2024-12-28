import {
  ClipboardPenLine,
  LayoutGrid,
  PackageCheck,
  ShoppingCart,
  Clipboard
} from "lucide-react"

import {
  SidebarGroup,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar"
import { Link } from "react-router-dom";

const dashboard = [
  {
    title: "Dashboard",
    url: "/",
    icon: LayoutGrid,
  },
];

const procurement = [
  {
    title: "Purchase Request",
    url: "/supply/purchase-request",
    icon: ClipboardPenLine,
  },
  {
    title: "Purchase Order",
    url: "/supply/purchase-order",
    icon: ShoppingCart,
  },
];

const inventory = [
  // {
  //   title: "Stocks",
  //   url: "/supply/stocks",
  //   icon: Layers,
  // },
  {
    title: "Inventory",
    url: "/supply/inventory",
    icon: Clipboard,
  },
  // {
  //   title: "Reports",
  //   url: "/supply/reports",
  //   icon: ClipboardList,
  // },
];

const distribution = [
  {
    title: "Item Distribution",
    url: "/supply/item-distribution",
    icon: PackageCheck
  }
]


export function SidebarItem() {

  return (
    <SidebarGroup className=" ">
      <SidebarGroupLabel>Analytics</SidebarGroupLabel>
      <SidebarMenu>
        {dashboard.map((item) => (
          <SidebarMenuItem key={item.title}>
            <SidebarMenuButton asChild className="px-4 py-6" isActive={location.pathname === item.url}>
              <Link to={item.url}>
                <item.icon />
                <span>{item.title}</span>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
        ))}
      </SidebarMenu>
      <SidebarGroupLabel>Procurement</SidebarGroupLabel>
      <SidebarMenu>
        {procurement.map((item) => (
          <SidebarMenuItem key={item.title}>
            <SidebarMenuButton asChild className="px-4 py-6" isActive={location.pathname === item.url}>
              <Link to={item.url}>
                <item.icon />
                <span>{item.title}</span>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
        ))}
      </SidebarMenu>
      <SidebarGroupLabel>Inventory</SidebarGroupLabel>
      <SidebarMenu>
        {inventory.map((item) => (
          <SidebarMenuItem key={item.title}>
            <SidebarMenuButton asChild className="px-4 py-6" isActive={location.pathname === item.url}>
              <Link to={item.url}>
                <item.icon />
                <span>{item.title}</span>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
        ))}
      </SidebarMenu>
      <SidebarGroupLabel>Distribution</SidebarGroupLabel>
      <SidebarMenu>
        {distribution.map((item) => (
          <SidebarMenuItem key={item.title}>
            <SidebarMenuButton asChild className="px-4 py-6" isActive={location.pathname === item.url}>
              <Link to={item.url}>
                <item.icon />
                <span>{item.title}</span>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
        ))}
      </SidebarMenu>
    </SidebarGroup>
  )
}
