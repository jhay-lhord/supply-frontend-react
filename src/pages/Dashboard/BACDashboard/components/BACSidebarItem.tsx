"use client";

import {
  ChevronRight,
  FileInput,
  FileOutput,
  FileTextIcon,
  FolderCheck,
  FolderDownIcon,
  LayoutDashboard,
} from "lucide-react";

import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import {
  SidebarGroup,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSub,
  SidebarMenuSubButton,
  SidebarMenuSubItem,
} from "@/components/ui/sidebar";
import { Link } from "react-router-dom";

const dashboard = [
  {
    title: "Dashboard",
    url: "/",
    icon: LayoutDashboard,
  },
];

const purchaseRequest = [
  {
    title: "Incoming Purchase Request",
    url: "/bac/purchase-request/incoming",
    icon: FolderDownIcon,
  },
  {
    title: "Received Purchase Request",
    url: "/bac/purchase-request/received",
    icon: FolderCheck,
  },
];

const quotations = [
  {
    title: "Request for Quotation",
    url: "",
    icon: FileInput,
    items: [
      {
        title: "List of all RFQs",
        url: "/bac/request-for-quotations",
        icon: FileInput,
      },
      {
        title: "Purchase Request with RFQ",
        url: "/bac/abstract-of-quotation",
        icon: FileOutput,
      },
    ],
  },
  {
    title: "Abstract Of Quotation",
    url: "",
    icon: FileOutput,
    items: [
      {
        title: "List of all AOQs",
        url: "/bac/abstract-of-quotations",
        icon: FileTextIcon,
      },
    ],
  },
];


export function SideBarItem() {
  return (
    <SidebarGroup>
      <SidebarGroupLabel>Dashboard</SidebarGroupLabel>
      <SidebarMenu>
        {dashboard.map((item) => (
          <SidebarMenuItem key={item.title}>
            <SidebarMenuButton asChild className="px-3 py-5" isActive={location.pathname === item.url}>
              <Link to={item.url}>
                <item.icon />
                <span>{item.title}</span>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
        ))}
      </SidebarMenu>
      <SidebarGroupLabel>Purchase Request</SidebarGroupLabel>
      <SidebarMenu>
        {purchaseRequest.map((item) => (
          <SidebarMenuItem key={item.title}>
            <SidebarMenuButton asChild className="px-3 py-5" isActive={location.pathname === item.url}>
              <Link to={item.url}>
                <item.icon />
                <span>{item.title}</span>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
        ))}
      </SidebarMenu>
      <SidebarGroupLabel>Quotation</SidebarGroupLabel>
      <SidebarMenu>
        {quotations.map((item) => (
          <Collapsible key={item.title} asChild className="group/collapsible" defaultOpen={true}>
            <SidebarMenuItem>
              <CollapsibleTrigger asChild>
                <SidebarMenuButton className="px-3 py-5" tooltip={item.title}>
                  {item.icon && <item.icon size={1} />}
                  <span>{item.title}</span>
                  <ChevronRight className="ml-auto transition-transform duration-200 group-data-[state=open]/collapsible:rotate-90" />
                </SidebarMenuButton>
              </CollapsibleTrigger>
              <CollapsibleContent>
                <SidebarMenuSub>
                  {item.items.map((subItem) => (
                    <SidebarMenuSubItem key={subItem.title}>
                      <SidebarMenuSubButton className="px-3 py-5" isActive={location.pathname === subItem.url}>
                        <Link to={subItem.url}>
                          <span>{subItem.title}</span>
                        </Link>
                      </SidebarMenuSubButton>
                    </SidebarMenuSubItem>
                  ))}
                </SidebarMenuSub>
              </CollapsibleContent>
            </SidebarMenuItem>
          </Collapsible>
        ))}
      </SidebarMenu>
    </SidebarGroup>
  );
}
