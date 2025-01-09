import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import AdminSidebar from "../AdminSidebar";
import useAuthStore from "@/components/Auth/AuthStore";

export default function Layout({ children }: { children: React.ReactNode }) {
  const { user } = useAuthStore()

  return (
    <SidebarProvider>
      <AdminSidebar />
      <main className="flex flex-col min-h-screen w-full">
        <div className="flex justify-between items-center bg-slate-50 sticky top-0 z-10">
          <div className="flex gap-6 py-6">
            <SidebarTrigger />
            <p className="text-xl font-bold">Hello, {user?.first_name}</p>
          </div>
        </div>
        <div className="flex   p-4">{children}</div>
      </main>
    </SidebarProvider>
  );
}
