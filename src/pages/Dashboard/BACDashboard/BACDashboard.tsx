import { TooltipProvider } from "@radix-ui/react-tooltip";
import {
  LayoutDashboard,
  FileSpreadsheet,
  FileSymlink,
  FileText,
  FileCheck,
 
} from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";   

import DashboardLayout from "@/pages/Dashboard/shared/Layouts/DashboardLayout";
import { SideNav } from "@/pages/Dashboard/shared/components/SideNav";
import { CalendarDateRangePicker } from "../shared/components/CalendarDateRangePicker";
import { RecentActivity } from "../shared/components/RecentActivity";
import { DataTable } from "../shared/components/DataTable";

const BACDashboard: React.FC = () => {
  
  return (
    <DashboardLayout>
      <TooltipProvider>
        <aside className="hidden md:flex flex-col w-auto h-screen p-2 border-r border-gray-200 sticky top-0 pt-16">
          <SideNav
            isCollapsed={false}
            links={[
              {
                title: "Dashboard",
                label: "",
                link_to: "/dashboard",
                icon: LayoutDashboard,
                variant: "default",
              },
              {
                title: "Reports",
                label: "",
                link_to: "/reports",
                icon: FileSpreadsheet,
                variant: "default",
              },
              {
                title: "Abstract of Quotation",
                label: "",
                link_to: "/AbstractOfQuotation",
                icon: FileText,
                variant: "default",
              },
              {
                title: "Request of Quotation",
                label: "",
                link_to: "/RequestOfQuotation",
                icon: FileCheck,
                variant: "default",
              },
              {
                title: "Transaction",
                label: "",
                link_to: "/transaction",
                icon: FileSymlink,
                variant: "default",
              },
            
            ]}
          />
        </aside>
      </TooltipProvider>

      {/* Main Content */}
      <ScrollArea className="w-full mt-14">
        <main className=" flex-grow">
          <div className="md:hidden"></div>
          <div className="hidden flex-col md:flex">
            <div className=" space-y-4 p-8 pt-6">
              <div className="flex items-center justify-between space-y-2">
                <h2 className="text-3xl font-bold tracking-tight">Dashboard</h2> 

                <div className="flex items-center space-x-2">
                  <CalendarDateRangePicker 
                   className="border-1 rounded border-orange-200" />
                  {/* <Button className="bg-orange-100 text-black hover:bg-orange-200">
                    Download
                  </Button> */}
                </div>
              </div>
              <div className="grid gap-4 md:grid-cols-1 lg:grid-cols-3">
                <Card className="hover:bg-orange-100 border-2 border-orange-100">
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium"> 

                      Active Bids
                    </CardTitle>
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      className="h-4 w-4 text-muted-foreground"
                    >
                      <path d="M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" />
                    </svg>
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">453</div> 

                    <p className="text-xs text-muted-foreground">
                      +20.1% from last month
                    </p>
                  </CardContent>
                </Card>
                <Card className="hover:bg-orange-100 border-2 border-orange-100">
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">   

                      Bids for Evaluation
                    </CardTitle>
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      className="h-4 w-4 text-muted-foreground"
                    >
                      <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
                      <circle cx="9" cy="7" r="4" />
                      <path d="M22 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75" />
                    </svg>
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">50</div>
                    <p className="text-xs text-muted-foreground"> 

                      +180.1% from last month
                    </p>
                  </CardContent>
                </Card>
                <Card className="hover:bg-orange-100 border-2 border-orange-100">
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium"> 

                      Bids Awards
                    </CardTitle>
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      className="h-4 w-4 text-muted-foreground"
                    >
                      <rect width="20" height="14" x="2" y="5" rx="2" />
                      <path d="M2 10h20" />
                    </svg>
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">4</div> 

                    <p className="text-xs text-muted-foreground">
                      +19% from last month
                    </p>
                  </CardContent>
                </Card>
              </div>
              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
                <Card className="col-span-4">
                  <CardHeader
                   className="">
                    <CardTitle>Active Bids</CardTitle>
                  </CardHeader>
                  <CardContent className="pl-2">
                    {/* <Overview /> */}
                    <DataTable />
                  </CardContent>
                </Card>
                
                <Card className="col-span-3">
                  <CardHeader className="sticky top-0 rounded-md bg-white z-50">
                    <CardTitle>Recent Activity</CardTitle>
                    <CardDescription>
                      You made 265 sales this month.
                    </CardDescription>
                  </CardHeader>
                  <ScrollArea className="h-96">
                    <CardContent className="">
                      <RecentActivity />
                    </CardContent>
                  </ScrollArea>
                </Card>

                
              </div>
            </div>
          </div>
        </main>
      </ScrollArea>
    </DashboardLayout>
  );
};

export default BACDashboard;