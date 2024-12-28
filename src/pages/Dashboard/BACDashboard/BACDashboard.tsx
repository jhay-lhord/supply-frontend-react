import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  CardFooter,
} from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { RecentActivities } from "../shared/components/RecentActivities";
import Layout from "./components/Layout/BACDashboardLayout";

import { Activity, FileText, Loader2 } from "lucide-react";
import { Bar, BarChart, CartesianGrid, XAxis, YAxis } from "recharts";
import { usePurchaseRequestInProgressCount } from "@/services/purchaseRequestServices";
import { useRequestForQuotationCount } from "@/services/requestForQoutationServices";
import { useAbstractOfQuotationCount } from "@/services/AbstractOfQuotationServices";

import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import { useGetBACDailyReport } from "@/services/DailyReport";

const chartConfig = {
  total_approved: {
    label: "Approved PR ",
    color: "hsl(var(--chart-1))",
  },
  total_quotation: {
    label: "Quotation ",
    color: "hsl(var(--chart-2))",
  },
  total_abstract: {
    label: "Abstract ",
    color: "hsl(var(--chart-3))",
  },
} satisfies ChartConfig;

const BACDashboard: React.FC = () => {
  const { inProgressCount, isLoading } = usePurchaseRequestInProgressCount();

  const { requestForQuotationCount, isLoading: quotation_loading } =
    useRequestForQuotationCount();

  const { abstractCount, isLoading: abstract_loading } =
    useAbstractOfQuotationCount();

  const { data } = useGetBACDailyReport();

  const chartData = data?.data;
  const reversedChartData = Array.isArray(chartData)
    ? [...chartData].reverse()
    : [];

  return (
    <Layout>
      <ScrollArea className="w-full">
        <main className="flex-grow">
          <div className=" flex-col md:flex">
            <div className=" space-y-4">
              <div className="flex items-center justify-between space-y-2">
                <h2 className="text-3xl font-bold tracking-tight">Dashboard</h2>

                <div className="flex items-center space-x-2"></div>
              </div>
              <div className="grid gap-4 md:grid-cols-1 lg:grid-cols-3">

                <Card
                  className={`bg-gradient-to-br from-orange-300 to-orange-400  border-0 text-white shadow-lg py-4 overflow-hidden relative`}
                >
                  <div className="absolute right-0 bottom-0 opacity-10 transform translate-x-1/4 translate-y-1/4">
                    <Activity className="w-32 h-32" />
                  </div>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-lg font-medium text-white/90">
                      Active Request
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="flex items-center justify-between">
                      <span className="text-4xl font-bold">
                        {isLoading ? (
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
                  className={`bg-gradient-to-br from-orange-300 to-orange-400 border-0 text-white shadow-lg py-4 overflow-hidden relative`}
                >
                   <div className="absolute right-0 bottom-0 opacity-10 transform translate-x-1/4 translate-y-1/4">
                    <FileText className="w-32 h-32" />
                  </div>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-lg font-medium text-white/90">
                      Request for Quotation
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="flex items-center justify-between">
                      <span className="text-4xl font-bold">
                        {quotation_loading ? (
                          <Loader2 className="animate-spin" />
                        ) : (
                          requestForQuotationCount
                        )}
                      </span>
                      <FileText className="h-6 w-6 text-white/80" />
                    </div>
                  </CardContent>
                </Card>

                <Card
                  className={`bg-gradient-to-br from-orange-300 to-orange-400 border-0 text-white shadow-lg py-4 overflow-hidden relative`}
                >
                   <div className="absolute right-0 bottom-0 opacity-10 transform translate-x-1/4 translate-y-1/4">
                    <FileText className="w-32 h-32" />
                  </div>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-lg font-medium text-white/90">
                      Abstract of Quotation
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="flex items-center justify-between">
                      <span className="text-4xl font-bold">
                        {abstract_loading ? (
                          <Loader2 className="animate-spin" />
                        ) : (
                          abstractCount
                        )}
                      </span>
                      <FileText className="h-6 w-6 text-white/80" />
                    </div>
                  </CardContent>
                </Card>
              </div>
              <div className="grid grid-cols-3 gap-4 md:grid-cols-2 lg:grid-cols-7">
                <Card className="col-span-4  bg-slate-100">
                  <CardHeader>
                    <CardTitle>Weekly Reports</CardTitle>
                    <CardDescription>
                      My Weekly Reports for the last 7 days
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
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
                          dataKey="total_approved"
                          fill="var(--color-total_approved)"
                          stackId={"a"}
                          barSize={25}
                        />

                        <Bar
                          dataKey="total_quotation"
                          fill={"var(--color-total_quotation)"}
                          stackId={"a"}
                          minPointSize={2}
                        />

                        <Bar
                          dataKey="total_abstract"
                          fill="var(--color-total_abstract)"
                          stackId={"a"}
                        />
                      </BarChart>
                    </ChartContainer>
                  </CardContent>
                  <CardFooter className="flex-col items-start gap-2 text-sm"></CardFooter>
                </Card>

                <Card className="col-span-3 bg-slate-100">
                  <CardHeader className="sticky top-0 rounded-md z-50">
                    <CardTitle>Recent Activity</CardTitle>
                  </CardHeader>
                  <ScrollArea className="h-96">
                    <CardContent className="">
                      <RecentActivities />
                    </CardContent>
                  </ScrollArea>
                </Card>
              </div>
            </div>
          </div>
        </main>
      </ScrollArea>
    </Layout>
  );
};

export default BACDashboard;
