import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  CardFooter
} from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
// import DashboardLayout from "@/pages/Dashboard/shared/Layouts/DashboardLayout";
import { RecentActivity } from "../shared/components/RecentActivity";
import Layout from "./components/Layout/BACDashboardLayout";

import { TrendingUp } from "lucide-react"
import { Bar, BarChart, CartesianGrid, XAxis } from "recharts"

import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart"

export const description = "A bar chart"
const chartData = [
  { month: "Monday", desktop: 10 },
  { month: "Tuesday", desktop: 305 },
  { month: "Wednesday", desktop: 237 },
  { month: "Thursday", desktop: 73 },
  { month: "Friday", desktop: 209 },
  { month: "Saturday", desktop: 214 },
  { month: "Sunday", desktop: 214 },
]
const chartConfig = {
  desktop: {
    label: "Desktop",
    color: "hsl(var(--chart-1))",
  },
} satisfies ChartConfig


const BACDashboard: React.FC = () => {
  return (
    <Layout>
      {/* <BACSidebar /> */}

      {/* Main Content */}
      <ScrollArea className="w-full">
        <main className=" flex-grow">
          <div className="md:hidden"></div>
          <div className="hidden flex-col md:flex">
            <div className=" space-y-4">
              <div className="flex items-center justify-between space-y-2">
                <h2 className="text-3xl font-bold tracking-tight">
                  BAC Dashboard
                </h2>

                <div className="flex items-center space-x-2"></div>
              </div>
              <div className="grid gap-4 md:grid-cols-1 lg:grid-cols-3">
                <Card className="bg-slate-100 border-none">
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-md font-medium">
                      Active Bids
                    </CardTitle>
                    <svg
                      width="20"
                      height="20"
                      viewBox="0 0 15 15"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                      className="text-muted-foreground"
                    >
                      <path
                        d="M8.69667 0.0403541C8.90859 0.131038 9.03106 0.354857 8.99316 0.582235L8.0902 6.00001H12.5C12.6893 6.00001 12.8625 6.10701 12.9472 6.27641C13.0319 6.4458 13.0136 6.6485 12.8999 6.80001L6.89997 14.8C6.76167 14.9844 6.51521 15.0503 6.30328 14.9597C6.09135 14.869 5.96888 14.6452 6.00678 14.4178L6.90974 9H2.49999C2.31061 9 2.13748 8.893 2.05278 8.72361C1.96809 8.55422 1.98636 8.35151 2.09999 8.2L8.09997 0.200038C8.23828 0.0156255 8.48474 -0.0503301 8.69667 0.0403541ZM3.49999 8.00001H7.49997C7.64695 8.00001 7.78648 8.06467 7.88148 8.17682C7.97648 8.28896 8.01733 8.43723 7.99317 8.5822L7.33027 12.5596L11.5 7.00001H7.49997C7.353 7.00001 7.21347 6.93534 7.11846 6.8232C7.02346 6.71105 6.98261 6.56279 7.00678 6.41781L7.66968 2.44042L3.49999 8.00001Z"
                        fill="currentColor"
                        fill-rule="evenodd"
                        clip-rule="evenodd"
                      ></path>
                    </svg>
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">0</div>
                  </CardContent>
                </Card>
                <Card className="bg-slate-100 border-none">
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-md font-medium">
                      Bids for Evaluation
                    </CardTitle>
                    <svg
                      width="20"
                      height="20"
                      viewBox="0 0 15 15"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                      className="text-muted-foreground"
                    >
                      <path
                        d="M4.2 1H4.17741H4.1774C3.86936 0.999988 3.60368 0.999978 3.38609 1.02067C3.15576 1.04257 2.92825 1.09113 2.71625 1.22104C2.51442 1.34472 2.34473 1.51442 2.22104 1.71625C2.09113 1.92825 2.04257 2.15576 2.02067 2.38609C1.99998 2.60367 1.99999 2.86935 2 3.17738V3.1774V3.2V11.8V11.8226V11.8226C1.99999 12.1307 1.99998 12.3963 2.02067 12.6139C2.04257 12.8442 2.09113 13.0717 2.22104 13.2837C2.34473 13.4856 2.51442 13.6553 2.71625 13.779C2.92825 13.9089 3.15576 13.9574 3.38609 13.9793C3.60368 14 3.86937 14 4.17741 14H4.2H10.8H10.8226C11.1306 14 11.3963 14 11.6139 13.9793C11.8442 13.9574 12.0717 13.9089 12.2837 13.779C12.4856 13.6553 12.6553 13.4856 12.779 13.2837C12.9089 13.0717 12.9574 12.8442 12.9793 12.6139C13 12.3963 13 12.1306 13 11.8226V11.8V3.2V3.17741C13 2.86936 13 2.60368 12.9793 2.38609C12.9574 2.15576 12.9089 1.92825 12.779 1.71625C12.6553 1.51442 12.4856 1.34472 12.2837 1.22104C12.0717 1.09113 11.8442 1.04257 11.6139 1.02067C11.3963 0.999978 11.1306 0.999988 10.8226 1H10.8H4.2ZM3.23875 2.07368C3.26722 2.05623 3.32362 2.03112 3.48075 2.01618C3.64532 2.00053 3.86298 2 4.2 2H10.8C11.137 2 11.3547 2.00053 11.5193 2.01618C11.6764 2.03112 11.7328 2.05623 11.7613 2.07368C11.8285 2.11491 11.8851 2.17147 11.9263 2.23875C11.9438 2.26722 11.9689 2.32362 11.9838 2.48075C11.9995 2.64532 12 2.86298 12 3.2V11.8C12 12.137 11.9995 12.3547 11.9838 12.5193C11.9689 12.6764 11.9438 12.7328 11.9263 12.7613C11.8851 12.8285 11.8285 12.8851 11.7613 12.9263C11.7328 12.9438 11.6764 12.9689 11.5193 12.9838C11.3547 12.9995 11.137 13 10.8 13H4.2C3.86298 13 3.64532 12.9995 3.48075 12.9838C3.32362 12.9689 3.26722 12.9438 3.23875 12.9263C3.17147 12.8851 3.11491 12.8285 3.07368 12.7613C3.05624 12.7328 3.03112 12.6764 3.01618 12.5193C3.00053 12.3547 3 12.137 3 11.8V3.2C3 2.86298 3.00053 2.64532 3.01618 2.48075C3.03112 2.32362 3.05624 2.26722 3.07368 2.23875C3.11491 2.17147 3.17147 2.11491 3.23875 2.07368ZM5 10C4.72386 10 4.5 10.2239 4.5 10.5C4.5 10.7761 4.72386 11 5 11H8C8.27614 11 8.5 10.7761 8.5 10.5C8.5 10.2239 8.27614 10 8 10H5ZM4.5 7.5C4.5 7.22386 4.72386 7 5 7H10C10.2761 7 10.5 7.22386 10.5 7.5C10.5 7.77614 10.2761 8 10 8H5C4.72386 8 4.5 7.77614 4.5 7.5ZM5 4C4.72386 4 4.5 4.22386 4.5 4.5C4.5 4.77614 4.72386 5 5 5H10C10.2761 5 10.5 4.77614 10.5 4.5C10.5 4.22386 10.2761 4 10 4H5Z"
                        fill="currentColor"
                        fill-rule="evenodd"
                        clip-rule="evenodd"
                      ></path>
                    </svg>
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">0</div>
                  </CardContent>
                </Card>
                <Card className="border-none bg-slate-100">
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-md font-medium">
                      Bids Awards
                    </CardTitle>
                    <svg
                      width="20"
                      height="20"
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      className=" text-muted-foreground"
                    >
                      <rect width="20" height="14" x="2" y="5" rx="2" />
                      <path d="M2 10h20" />
                    </svg>
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">0</div>
                  </CardContent>
                </Card>
              </div>
              <div className="grid grid-cols-3 gap-4 md:grid-cols-2 lg:grid-cols-7">
                {/* <Card className="col-span-4  bg-slate-100">
                  <CardHeader className=" border-none">
                    <CardTitle>Active Bids</CardTitle>
                  </CardHeader>
                  <CardContent className="pl-2">
                   
                    <DataTable />
                  </CardContent>
                </Card> */}

                <Card className="col-span-4  bg-slate-100" >
                  <CardHeader>
                    <CardTitle>Bar Chart</CardTitle>
                    <CardDescription>January - June 2024</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <ChartContainer config={chartConfig}>
                      <BarChart accessibilityLayer data={chartData}>
                        <CartesianGrid vertical={false} />
                        <XAxis
                          dataKey="month"
                          tickLine={false}
                          tickMargin={10}
                          axisLine={false}
                          tickFormatter={(value) => value.slice(0, 3)}
                        />
                        <ChartTooltip
                          cursor={false}
                          content={<ChartTooltipContent hideLabel />}
                        />
                        <Bar
                          dataKey="desktop"
                          fill="var(--color-desktop)"
                          radius={10}
                          width={20}
                          
                        />
                      </BarChart>
                    </ChartContainer>
                  </CardContent>
                  <CardFooter className="flex-col items-start gap-2 text-sm">
                    <div className="flex gap-2 font-medium leading-none">
                      Trending up by 5.2% this month{" "}
                      <TrendingUp className="h-4 w-4" />
                    </div>
                    <div className="leading-none text-muted-foreground">
                      Showing total visitors for the last 6 months
                    </div>
                  </CardFooter>
                </Card>

                <Card className="col-span-3 bg-slate-100">
                  <CardHeader className="sticky top-0 rounded-md z-50">
                    <CardTitle>Recent Activity</CardTitle>
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
    </Layout>
  );
};

export default BACDashboard;
