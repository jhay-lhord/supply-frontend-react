import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { useNavigate } from "react-router-dom";
import { ScrollArea } from "@/components/ui/scroll-area";
import { RecentActivities } from "../shared/components/RecentActivities";

import {
  useItemsDeliveredCount,
  usePurchaseOrderCancelledCount,
  usePurchaseOrderCompletedCount,
  usePurchaseOrderPendingCount,
} from "@/services/puchaseOrderServices";
import { FileText, Package, ShoppingBag } from "lucide-react";
import Layout from "./components/Layout/SupplyDashboardLayout";
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import { Bar, BarChart, CartesianGrid, XAxis, YAxis } from "recharts";
import { useGetSupplyDailyReport } from "@/services/DailyReport";
import { Button } from "@/components/ui/button";
import {
  usePurchaseRequestCompletedCount,
  usePurchaseRequestInProgressCount,
  usePurchaseRequestPendingCount,
} from "@/services/purchaseRequestServices";

const chartConfig = {
  total_active_pr: {
    label: "All Purchase Request",
    color: "hsl(var(--chart-1))",
  },
  total_inprogress_pr: {
    label: "Purchase Request In Progress ",
    color: "hsl(var(--chart-2))",
  },
  total_inprogress_po: {
    label: "Purchase Order In Progress ",
    color: "hsl(var(--chart-3))",
  },
} satisfies ChartConfig;

const SupplyDashboard: React.FC = () => {

  const { requestPendingCount } = usePurchaseRequestPendingCount();
  const { requestInProgressCount } = usePurchaseRequestInProgressCount();
  const { requestCompletedCount } = usePurchaseRequestCompletedCount();

  const { pendingCount } = usePurchaseOrderPendingCount();
  const { completedCount } = usePurchaseOrderCompletedCount();
  const { cancelledCount } = usePurchaseOrderCancelledCount();

  const { itemDeliveredCount } = useItemsDeliveredCount();

  const navigate = useNavigate();

  const { data } = useGetSupplyDailyReport();

  const chartData = data?.data;
  const reversedChartData = Array.isArray(data?.data)
    ? [...chartData]?.reverse()
    : [];

  console.log(chartData)
  return (
    <Layout>
      <ScrollArea className="w-full">
        <main className=" flex-grow">
          <div className=""></div>
          <div className=" flex-col md:flex">
            <div className=" space-y-4">
              <div className="flex items-center justify-between space-y-2">
                <h2 className="text-3xl font-bold tracking-tight">Dashboard</h2>
              </div>
              <div className="grid gap-4 md:grid-cols-1 lg:grid-cols-3">
                <Card
                  className={`bg-gradient-to-br from-orange-300 to-orange-400 border-0 text-white shadow-lg overflow-hidden relative`}
                >
                  <div className="absolute right-0 bottom-0 opacity-10 transform translate-x-1/4 translate-y-1/4">
                    <FileText className="w-32 h-32" />
                  </div>
                  <CardHeader className="">
                    <CardTitle className="text-2xl font-medium text-black/90">
                      Purchase Request
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="">
                      <div className="flex justify-between w-full">
                        <div className="flex flex-col items-center ">
                          <p className="text-sm text-black/90">Pending</p>
                          <p className="text-2xl ">{requestPendingCount}</p>
                        </div>
                        <div className="flex flex-col items-center">
                          <p className="text-sm text-black/90">On going</p>
                          <p className="text-2xl">{requestInProgressCount}</p>
                        </div>
                        <div className="flex flex-col items-center">
                          <p className="text-sm text-black/90">Completed</p>
                          <p className="text-2xl">{requestCompletedCount}</p>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                  <CardFooter>
                    <Button
                      className="w-full"
                      onClick={() => {
                        navigate("/supply/purchase-request");
                      }}
                    >
                      View All
                    </Button>
                  </CardFooter>
                </Card>
                <Card
                  className={`bg-gradient-to-br from-orange-300 to-orange-400 border-0 text-white shadow-lg overflow-hidden relative`}
                >
                  <div className="absolute right-0 bottom-0 opacity-10 transform translate-x-1/4 translate-y-1/4">
                    <ShoppingBag className="w-32 h-32" />
                  </div>
                  <CardHeader className="">
                    <CardTitle className="text-2xl font-medium text-black/90">
                      Purchase Order
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="flex items-center justify-between">
                      <div className="flex justify-between w-full">
                        <div className="flex flex-col items-center">
                          <p className="text-sm text-black/90">Pending</p>
                          <p className="text-2xl">{pendingCount}</p>
                        </div>
                        <div className="flex flex-col items-center">
                          <p className="text-sm text-black/90">Completed</p>
                          <p className="text-2xl">{completedCount}</p>
                        </div>
                        <div className="flex flex-col items-center">
                          <p className="text-sm text-black/90">Cancelled</p>
                          <p className="text-2xl">{cancelledCount}</p>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                  <CardFooter>
                    <Button
                      className="w-full"
                      onClick={() => {
                        navigate("/supply/purchase-order");
                      }}
                    >
                      View All
                    </Button>
                  </CardFooter>
                </Card>
                <Card
                  className={`bg-gradient-to-br from-orange-300 to-orange-400 border-0 text-white shadow-lg overflow-hidden relative`}
                >
                  <div className="absolute right-0 bottom-0 opacity-10 transform translate-x-1/4 translate-y-1/4">
                    <Package className="w-32 h-32" />
                  </div>
                  <CardHeader className="">
                    <CardTitle className="text-2xl font-medium text-black/90">
                      Inventory
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="flex items-center justify-between">
                      <div className="flex w-full">
                        <div className=" flex justify-between items-center w-full">
                          <p className="flex flex-col items-center text-sm text-black/90">
                            Items Delivered
                            <p className="text-2xl text-white/90">{itemDeliveredCount}</p>
                          </p>
                          <div className="">
                            <Package className="h-6 w-6 text-white/80" />
                          </div>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                  <CardFooter>
                    <Button
                      className="w-full"
                      onClick={() => {
                        navigate("/supply/item-distribution");
                      }}
                    >
                      View All
                    </Button>
                  </CardFooter>
                </Card>
              </div>
              <div className="grid gap-4 md:grid-cols-1 lg:grid-cols-5">
                <Card className="col-span-3 bg-slate-100">
                  <CardHeader>
                    <CardTitle>Weekly Reports</CardTitle>
                    <CardDescription>
                      My Weekly Reports for the last 7 days
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="">
                    <ChartContainer config={chartConfig}>
                      <BarChart accessibilityLayer data={reversedChartData}>
                        <CartesianGrid vertical={false} />
                        <XAxis
                          dataKey="day"
                          tickLine={false}
                          tickMargin={10}
                          axisLine={false}
                        />
                        <YAxis
                          axisLine={false}
                          tickLine={false}
                          tickMargin={10}
                          allowDecimals={false}
                          tickFormatter={(value) => value.toFixed(0)}
                          tick={{ fill: "#4b5563" }}
                        />
                        <ChartTooltip
                          cursor={false}
                          content={<ChartTooltipContent indicator="dot" />}
                        />
                        <Bar
                          dataKey="total_active_pr"
                          fill="var(--color-total_active_pr)"
                          stackId={"a"}
                          barSize={25}
                          minPointSize={2}
                        />

                        <Bar
                          dataKey="total_inprogress_pr"
                          fill={"var(--color-total_inprogress_pr)"}
                          stackId={"a"}
                          barSize={25}
                        />

                        <Bar
                          dataKey="total_inprogress_po"
                          fill="var(--color-total_inprogress_po)"
                          stackId={"a"}
                          barSize={25}
                        />
                      </BarChart>
                    </ChartContainer>
                  </CardContent>
                </Card>
                <Card className="col-span-2 bg-slate-100">
                  <CardHeader className="sticky top-0 rounded-m z-50">
                    <CardTitle>Recent Activity</CardTitle>
                    <CardDescription>History as of this month</CardDescription>
                  </CardHeader>
                  <CardContent className="">
                    <ScrollArea className="h-80">
                      <RecentActivities />
                    </ScrollArea>
                  </CardContent>
                </Card>
              </div>
            </div>
          </div>
        </main>
      </ScrollArea>
    </Layout>
  );
};

export default SupplyDashboard;
