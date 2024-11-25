import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import BACSidebar from "../BACSidebar";
import { UserNav } from "@/pages/Dashboard/shared/components/UserNav";
import { greetings } from "@/services/greeting";

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <SidebarProvider>
      <BACSidebar />
      <main className="flex flex-col min-h-screen w-full">
        <div className="flex justify-between items-center bg-slate-50 sticky top-0 z-10">
          <div className="flex gap-6">
          <SidebarTrigger />
          <h1 className="text-xl font-normal">{greetings()}</h1>
          </div>
          <header className=" ">
            <div className="flex h-16 items-center px-4">
              <div className="ml-auto flex items-center space-x-4">
                <UserNav />
              </div>
            </div>
          </header>
        </div>
        <div className="flex bg-slate-200 h-screen p-4">{children}</div>
      </main>
    </SidebarProvider>
  );
}
