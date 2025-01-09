import SupplySidebar from "../SupplySidebar";
import { Separator } from "@/components/ui/separator";
import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar";
import { FloatingButton } from "../QuickAccess";
import useAuthStore from "@/components/Auth/AuthStore";
import { useState } from "react";
import PDFGeneratorDialog from "@/pages/Dashboard/SupplyDashboard/components/SupplyPDFGenerator";
import TrackPurchaseRequestDialog from "@/pages/Dashboard/shared/components/TrackPurchaseRequestDialog";

export default function Layout({ children }: { children: React.ReactNode }) {
  const [isPDFGeneratorOpen, setIsPDFGeneratorOpen] = useState<boolean>(false);
  const [isSearchDialogOpen, setIsSearchDialogOpen] = useState<boolean>(false);

  const { user } = useAuthStore();

  const buttons = [
    { label: "PDF Generator", onClick: () => setIsPDFGeneratorOpen(true) },
    {
      label: "Track Purchase Request",
      onClick: () => setIsSearchDialogOpen(true),
    },
  ];
  return (
    <SidebarProvider>
      <SupplySidebar />
      <SidebarInset>
        <header className="flex h-16 sticky top-0 z-10 bg-slate-50 border shrink-0 items-center gap-2 transition-[width,height] ease-linear group-has-[[data-collapsible=icon]]/sidebar-wrapper:h-12">
          <div className="flex items-center gap-2 px-4">
            <SidebarTrigger className="-ml-1" />
            <Separator orientation="vertical" className="mr-2 h-4" />
            <p className="text-xl font-bold">Hello, {user?.first_name}</p>
          </div>
        </header>
        <main className="flex p-10">
          <FloatingButton buttons={buttons} />
          {children}
        </main>
      </SidebarInset>
      <PDFGeneratorDialog
        isOpen={isPDFGeneratorOpen}
        setIsOpen={setIsPDFGeneratorOpen}
      />
      <TrackPurchaseRequestDialog
        isOpen={isSearchDialogOpen}
        setIsOpen={setIsSearchDialogOpen}
      />
    </SidebarProvider>
  );
}
