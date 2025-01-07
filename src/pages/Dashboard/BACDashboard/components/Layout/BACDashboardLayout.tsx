import { Separator } from "@/components/ui/separator";
import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar";
import BACSidebar from "../BACSidebar";
import useAuthStore from "@/components/Auth/AuthStore";

export default function Layout({ children }: { children: React.ReactNode }) {
  const { user } = useAuthStore()

  return (
    <SidebarProvider>
      <BACSidebar />
      <SidebarInset>
        <header className="flex h-16 sticky top-0 z-10 bg-slate-50 border shrink-0 items-center gap-2 transition-[width,height] ease-linear group-has-[[data-collapsible=icon]]/sidebar-wrapper:h-12">
          <div className="flex items-center gap-2 px-4">
            <SidebarTrigger className="-ml-1" />
            <Separator orientation="vertical" className="mr-2 h-4" />
            <p className="text-xl font-bold">Hello, {user?.first_name}</p>
            {/* <Breadcrumb>
              <BreadcrumbList>
                <BreadcrumbItem className="hidden md:block">
                  <BreadcrumbLink href="#">
                    Building Your Application
                  </BreadcrumbLink>
                </BreadcrumbItem>
                <BreadcrumbSeparator className="hidden md:block" />
                <BreadcrumbItem>
                  <BreadcrumbPage>Data Fetching</BreadcrumbPage>
                </BreadcrumbItem>
              </BreadcrumbList>
            </Breadcrumb> */}
          </div>
        </header>
        <main className="flex p-10">{children}</main>
      </SidebarInset>
    </SidebarProvider>
  );
}
