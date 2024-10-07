import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { ScrollArea } from "@/components/ui/scroll-area";
import DashboardLayout from "@/pages/Dashboard/shared/Layouts/DashboardLayout";
import { CalendarDateRangePicker } from "../shared/components/CalendarDateRangePicker";
import { RecentActivity } from "../shared/components/RecentActivity";
import { DataTable } from "../shared/components/DataTable";
import { getPurchaseRequestCount, GetPurchaseRequestItem } from "@/services/purchaseRequestServices";
import SupplySidebar from "./components/SupplySidebar";

const SupplyDashboard: React.FC = () => {
  const [purchaseRequestCount, setPurchaseRequestCount] = useState<number | null>(null);
  const [error, setError] = useState<string | null >(null)

  const navigate = useNavigate()
  const fetchPurchaseRequestItem = async () => {

    const items = await GetPurchaseRequestItem()
    const filteredPr = items.data?.filter(item => item.pr_no.pr_no === pr_no)
    const displayItemDescription = filteredPr?.map(item => item.item_no.item_description)
    console.log(displayItemDescription)
  }

  fetchPurchaseRequestItem()



  useEffect(() => {
    const fetchPurchaseRequestCount = async () => {
      try {
        const count = await getPurchaseRequestCount()
        setPurchaseRequestCount(count)
      } catch (err) {
        setError('something went wrong')
        console.error(err, error)
      }
    }

    fetchPurchaseRequestCount()
  }, [])
  return (
    <DashboardLayout>
      <SupplySidebar/>
      {/* Main Content */}
      <ScrollArea className="w-full mt-14">
        <main className=" flex-grow">
          <div className="md:hidden"></div>
          <div className="hidden flex-col md:flex">
            <div className=" space-y-4 p-8 pt-6">
              <div className="flex items-center justify-between space-y-2">
                <h2 className="text-3xl font-bold tracking-tight">Dashboard</h2>
                <div className="flex items-center space-x-2">
                  <CalendarDateRangePicker className="border-1 rounded border-orange-200" />
                  <Button className="bg-orange-200 text-black hover:bg-orange-300">
                    Download
                  </Button>
                </div>
              </div>
              <div className="grid gap-4 md:grid-cols-1 lg:grid-cols-3">
                <Card className="hover:bg-orange-200 border-2 border-orange-200" onClick={() => {
                  navigate('/purchase-request')
                }}>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">
                      Active Request
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
                    <div className="text-2xl font-bold">{purchaseRequestCount}</div>
                    <p className="text-xs text-muted-foreground">
                      +20.1% from last month
                    </p>
                  </CardContent>
                </Card>
                <Card className="hover:bg-orange-200 border-2 border-orange-200">
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">
                      Qoutation
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
                <Card className="hover:bg-orange-200 border-2 border-orange-200">
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">
                      Order in Progress
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
              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7 ">
                <Card className="col-span-4 border-orange-200 rounded border-2">
                  <CardHeader className="flex">
                    <CardTitle>Purchase Request</CardTitle>
                  </CardHeader>
                  <CardContent className="pl-2">
                    {/* <Overview /> */}
                    <DataTable />
                  </CardContent>
                </Card>
                <Card className="col-span-3 border-2 border-orange-200">
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

export default SupplyDashboard;
