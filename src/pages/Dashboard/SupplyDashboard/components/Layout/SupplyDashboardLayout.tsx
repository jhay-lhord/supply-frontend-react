import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { greetings } from "@/services/greeting";
import SupplySidebar from "../SupplySidebar";

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <SidebarProvider>
      <SupplySidebar />
      <main className="flex flex-col min-h-screen w-full">
        <div className="flex justify-between items-center bg-slate-50 sticky top-0 z-10">
          <div className="flex gap-6 py-6">
            <SidebarTrigger />
            <h1 className="text-xl font-normal">{greetings()}</h1>
          </div>
        </div>
        <div className="flex   p-4">{children}</div>
      </main>
    </SidebarProvider>
  );
}
