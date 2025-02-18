import {
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";

export function SidebarUserHeader() {
  return (
    <SidebarMenu>
      <SidebarMenuItem>
        <SidebarMenuButton
          size="lg"
          className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground hover:cursor-default"
        >
          <div className="flex aspect-square size-8 items-center justify-center rounded-lg  text-sidebar-primary-foreground">
            <img src="/ctu-logo.ico" alt="Icon" className="size-8" />
          </div>
          <div className="grid flex-1 text-left text-sm leading-tight">
            <span className="truncate font-semibold text-lg">CTU-ARGAO CAMPUS</span>
            <span className="truncate text-xs">SUPPLY MANAGEMENT SYSTEM</span>
          </div>
        </SidebarMenuButton>
      </SidebarMenuItem>
    </SidebarMenu>
  );
}
