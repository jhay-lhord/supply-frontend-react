import { SidebarUserHeader } from "../../shared/components/SidebarHeader"
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarRail,
} from "@/components/ui/sidebar"
import { CustomSidebarFooter } from "../../shared/components/SidebarFooter"
import { SideBarItem } from "./BACSidebarItem"



export default function SupplySidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  return (
    <Sidebar collapsible="icon" {...props}>
      <SidebarHeader>
        <SidebarUserHeader />
      </SidebarHeader>
      <SidebarContent>
        <SideBarItem />
      </SidebarContent>
      <SidebarFooter>
        <CustomSidebarFooter/>
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  )
}