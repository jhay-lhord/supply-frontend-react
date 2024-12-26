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

import { useBACmemberCount } from "@/services/BACmemberServices";
import { useCampusDirectorCount } from "@/services/campusDirectorServices";
import { useRequisitionerCount } from "@/services/requisitionerServices";
import { useUserCount } from "@/services/userServices";

import { Loader2, User, Users, UsersRound } from "lucide-react";
import Layout from "./components/Layout/AdminDashboardLayout";
import { Button } from "@/components/ui/button";

interface CardData {
  title: string;
  route: string;
  icon: React.ElementType;
  count: number;
  isLoading: boolean;
}

const AdminDashboard: React.FC = () => {
  const { BACmemberCount, isLoading: isBACmemberLoading } = useBACmemberCount();
  const { CampusDirectorCount, isLoading: isCampusDirectorLoading } =
    useCampusDirectorCount();
  const { RequisitionerCount, isLoading: isRequisitionerLoading } =
    useRequisitionerCount();
  const { UserCount, isLoading: isUserLoading } = useUserCount();

  const cardData: CardData[] = [
    {
      title: "Users",
      route: "/admin/users",
      icon: User,
      count: UserCount ?? 0,
      isLoading: isUserLoading,
    },
    {
      title: "Requisitioners",
      route: "/admin/requisitioner",
      icon: Users,
      count: RequisitionerCount ?? 0,
      isLoading: isRequisitionerLoading,
    },
    {
      title: "Campus Director",
      route: "/admin/campus-director",
      icon: User,
      count: CampusDirectorCount ?? 0,
      isLoading: isCampusDirectorLoading,
    },
    {
      title: "BAC Members",
      route: "/admin/BACmembers",
      icon: UsersRound,
      count: BACmemberCount ?? 0,
      isLoading: isBACmemberLoading,
    },
  ];


  const navigate = useNavigate();

  return (
    <Layout>
      <ScrollArea className="w-full">
        <main className=" flex-grow">
          <div className="hidden flex-col md:flex">
            <div className=" space-y-6 p-8">
              <div className="flex items-center justify-between space-y-2">
                <h2 className="text-3xl font-bold tracking-tight">Dashboard</h2>
              </div>
              <div className="grid gap-4 md:grid-cols-1 lg:grid-cols-8">
                <div className="lg:col-span-4 grid gap-4 md:grid-cols-1 lg:grid-cols-2">
                  {cardData.map((card, index) => (
                    <Card
                      key={index}
                      className="bg-white border-none hover:shadow-lg transition-shadow duration-300 overflow-hidden relative flex flex-col"
                    >
                      <div className="absolute inset-0 opacity-5">
                        <card.icon className="w-full h-full" />
                      </div>
                      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-xl font-semibold text-gray-800">
                          {card.title}
                        </CardTitle>
                        <card.icon className="h-6 w-6 text-orange-300" />
                      </CardHeader>
                      <CardContent className="flex-grow">
                        <div className="text-3xl font-bold text-orange-300">
                          {card.isLoading ? (
                            <Loader2 className="animate-spin" />
                          ) : (
                            card.count
                          )}
                        </div>
                      </CardContent>
                      <CardFooter className="pt-2 z-10">
                        <Button
                          onClick={() => navigate(card.route)}
                          className="w-full hover:cursor-pointer bg-orange-300 hover:bg-orange-200 text-white"
                        >
                          View all
                        </Button>
                      </CardFooter>
                    </Card>
                  ))}
                </div>

                <div className="lg:col-span-4">
                  <Card className="bg-slate-100 border-none">
                    <CardHeader className="sticky top-0 rounded-m z-50">
                      <CardTitle>Recent Activity</CardTitle>
                      <CardDescription>
                        History as of this month
                      </CardDescription>
                    </CardHeader>
                    <ScrollArea className="h-96">
                      <CardContent>
                        <RecentActivities />
                      </CardContent>
                    </ScrollArea>
                  </Card>
                </div>
              </div>
            </div>
          </div>
        </main>
      </ScrollArea>
    </Layout>
  );
};

export default AdminDashboard;
