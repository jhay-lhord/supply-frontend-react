import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { useNavigate } from "react-router-dom";
import { ScrollArea } from "@/components/ui/scroll-area";
import { RecentActivities } from "../shared/components/RecentActivities";
import {
  usePurchaseRequestCount,
  usePurchaseRequestInProgressCount,
} from "@/services/purchaseRequestServices";
import { usePurchaseOrderCount } from "@/services/puchaseOrderServices";
import { Activity, Loader2 } from "lucide-react";
import Layout from "./components/Layout/SupplyDashboardLayout";
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import { Bar, BarChart, CartesianGrid, XAxis, YAxis } from "recharts";
import { useGetSupplyDailyReport } from "@/services/DailyReport";

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
  const { purchase_order_count, isLoading: isPurchaseOrderLoading } =
    usePurchaseOrderCount();

  const { purchaseRequestCount, isLoading: isPurchaseRequestLoading } =
    usePurchaseRequestCount();

  const { inProgressCount, isLoading: isInProgressLoading } =
    usePurchaseRequestInProgressCount();

  const navigate = useNavigate();

  const { data } = useGetSupplyDailyReport();

  const chartData = data?.data
  const reversedChartData = Array.isArray(data?.data) ?  [...chartData]?.reverse() : [];

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
                  className={`bg-gradient-to-br from-orange-300 to-orange-400 border-0 text-white shadow-lg py-4`}
                  onClick={() => {
                    navigate("/supply/purchase-request");
                  }}
                >
                  <CardHeader className="pb-2">
                    <CardTitle className="text-lg font-medium text-white/90">
                      Active Request
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="flex items-center justify-between">
                      <span className="text-4xl font-bold">
                      {isPurchaseRequestLoading ? (
                        <Loader2 className="animate-spin" />
                      ) : (
                        purchaseRequestCount
                      )}
                      </span>
                      <Activity className="h-6 w-6 text-white/80" />
                    </div>
                  </CardContent>
                </Card>
                   <Card
                  className={`bg-gradient-to-br from-orange-300 to-orange-400 border-0 text-white shadow-lg py-4`}
                  onClick={() => {
                    navigate("/supply/in-progress");
                  }}
                >
                  <CardHeader className="pb-2">
                    <CardTitle className="text-lg font-medium text-white/90">
                    Pending Request
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="flex items-center justify-between">
                      <span className="text-4xl font-bold">
                      {isInProgressLoading ? (
                        <Loader2 className="animate-spin" />
                      ) : (
                        inProgressCount
                      )}
                      </span>
                      <Activity className="h-6 w-6 text-white/80" />
                    </div>
                  </CardContent>
                </Card>
                 <Card
                  className={`bg-gradient-to-br from-orange-300 to-orange-400 border-0 text-white shadow-lg py-4`}
                  onClick={() => {
                    navigate("/supply/purchase-order");
                  }}
                >
                  <CardHeader className="pb-2">
                    <CardTitle className="text-lg font-medium text-white/90">
                    Pending Orders
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="flex items-center justify-between">
                      <span className="text-4xl font-bold">
                      {isPurchaseOrderLoading ? (
                        <Loader2 className="animate-spin" />
                      ) : (
                        purchase_order_count
                      )}
                      </span>
                      <Activity className="h-6 w-6 text-white/80" />
                    </div>
                  </CardContent>
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
