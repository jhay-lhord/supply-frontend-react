import { ChevronsUpDownIcon } from "lucide-react";
import { FileTextIcon, DashboardIcon } from "@radix-ui/react-icons";

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
  SidebarMenuSub,
  SidebarMenuSubButton,
  SidebarMenuSubItem,
  useSidebar,
} from "@/components/ui/sidebar";
import Logo from "/public/CTU_new_logotransparent.svg";
import { BACSidebarFooter } from "./BACSidebarFooter";
import { useLocation } from "react-router-dom";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";

const dashboard = [
  {
    title: "Dashboard",
    url: "/",
    icon: DashboardIcon,
  },
];

const purchase_request = [
  {
    title: "Approved PR",
    url: "/bac/purchase-request",
    icon: FileTextIcon,
  },
];

const quotation = {
  title: "Request For Quotation",
  url: "",
  icon: FileTextIcon,
};

const quotation_sub = [
  {
    title: "List of all RFQs",
    url: "/bac/request-for-quotations",
    icon: FileTextIcon,
  },
];

const abstract = {
  title: "Abstract Of Quotation",
  url: "",
  icon: FileTextIcon,
};

const abstract_sub = [
  {
    title: "Purchase Request with RFQ",
    url: "/bac/abstract-of-quotations",
    icon: FileTextIcon,
  },
  {
    title: "List of all AOQs",
    url: "/bac/abstract-of-quotations",
    icon: FileTextIcon,
  },
];

const BACSidebar = () => {
  const { open } = useSidebar();
  const location = useLocation();

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
                  <SidebarMenuButton
                    asChild
                    className="px-3 py-5 "
                    isActive={location.pathname === item.url}
                  >
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
                  <SidebarMenuButton
                    asChild
                    className="px-3 py-5  hover:bg-orange-100"
                    isActive={location.pathname === item.url}
                  >
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
              <Collapsible defaultOpen>
                <SidebarMenuItem key={abstract.title}>
                  <CollapsibleTrigger asChild>
                    <SidebarMenuButton
                      asChild
                      className="px-3 py-5  hover:bg-orange-100"
                      isActive={location.pathname === quotation.url}
                    >
                      <div className="flex justify-between"> 
                        <div className="flex gap-2">
                          <quotation.icon />
                          <p>{quotation.title}</p>
                        </div>
                        <ChevronsUpDownIcon />
                      </div>
                    </SidebarMenuButton>
                  </CollapsibleTrigger>
                  <CollapsibleContent>
                    <SidebarMenuSub>
                      {quotation_sub.map((data) => (
                        <SidebarMenuSubItem>
                          <SidebarMenuSubButton
                            asChild
                            className="px-3 py-5  hover:bg-orange-100"
                            isActive={location.pathname === data.url}
                          >
                            <a href={data.url}>
                              <p>{data.title}</p>
                            </a>
                          </SidebarMenuSubButton>
                        </SidebarMenuSubItem>
                      ))}
                    </SidebarMenuSub>
                  </CollapsibleContent>
                </SidebarMenuItem>
              </Collapsible>
              <Collapsible defaultOpen>
                <CollapsibleTrigger asChild>
                  <SidebarMenuButton
                    asChild
                    className="px-3 py-5  hover:bg-orange-100"
                    isActive={location.pathname === abstract.url}
                  >
                    <div className="flex justify-between">
                      <div className="flex gap-2">
                        <abstract.icon />
                        <p>{abstract.title}</p>
                      </div>
                      <ChevronsUpDownIcon />
                    </div>
                  </SidebarMenuButton>
                </CollapsibleTrigger>
                <CollapsibleContent>
                  <SidebarMenuSub>
                    {abstract_sub.map((data) => (
                      <SidebarMenuSubItem>
                        <SidebarMenuSubButton
                          asChild
                          className="px-3 py-5  hover:bg-orange-100"
                          isActive={location.pathname === data.url}
                        >
                          <a href={data.url}>
                            <p>{data.title}</p>
                          </a>
                        </SidebarMenuSubButton>
                      </SidebarMenuSubItem>
                    ))}
                  </SidebarMenuSub>
                </CollapsibleContent>
              </Collapsible>
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
      <SidebarFooter>
        <BACSidebarFooter />
      </SidebarFooter>
    </Sidebar>
  );
};

export default BACSidebar;
