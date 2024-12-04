import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { useNavigate } from "react-router-dom";
import { ScrollArea } from "@/components/ui/scroll-area";
import DashboardLayout from "@/pages/Dashboard/shared/Layouts/DashboardLayout";
import { RecentActivities } from "../shared/components/RecentActivities";

import { useBACmemberCount } from "@/services/BACmemberServices";
import { useCampusDirectorCount } from "@/services/campusDirectorServices";
import { useRequisitionerCount } from "@/services/requisitionerServices";
import { useUserCount } from "@/services/userServices";

import AdminSidebar from "./components/AdminSidebar";
import { Loader2, UserIcon, UsersIcon, UsersRoundIcon } from "lucide-react";

const AdminDashboard: React.FC = () => {
  const { BACmemberCount, isLoading: isBACmemberLoading } = useBACmemberCount();
  const { CampusDirectorCount, isLoading: isCampusDirectorLoading } =
    useCampusDirectorCount();
  const { RequisitionerCount, isLoading: isRequisitionerLoading } =
    useRequisitionerCount();
  const { UserCount, isLoading: isUserLoading } = useUserCount();

  const navigate = useNavigate();

  return (
    <DashboardLayout>
      <AdminSidebar />
      {/* Main Content */}
      <ScrollArea className="w-full mt-14">
        <main className=" flex-grow">
          <div className="md:hidden"></div>
          <div className="hidden flex-col md:flex">
            <div className=" space-y-20 p-8 pt-6">
              <div className="flex items-center justify-between space-y-2">
                <h2 className="text-3xl font-bold tracking-tight">Dashboard</h2>
              </div>
              <div className="grid gap-4 md:grid-cols-1 lg:grid-cols-8">
                {/* First Row: 4 Boxes */}
                <div className="lg:col-span-4 grid gap-4 md:grid-cols-1 lg:grid-cols-2">
                  <Card
                    className="bg-slate-100 border-none hover:cursor-pointer"
                    onClick={() => navigate("/admin/users")}
                  >
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                      <CardTitle className="text-2xl font-semibold">
                        Users
                      </CardTitle>
                      <UserIcon />
                    </CardHeader>
                    <CardContent>
                      <div className="text-3xl text-orange-300">
                        {isUserLoading ? (
                          <Loader2 className="animate-spin" />
                        ) : (
                          UserCount
                        )}
                      </div>
                    </CardContent>
                  </Card>

                  <Card
                    className="bg-slate-100 border-none hover:cursor-pointer"
                    onClick={() => navigate("/admin/requisitioner")}
                  >
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                      <CardTitle className="text-2xl font-semibold">
                        Requisitioners
                      </CardTitle>
                      <UsersIcon />
                    </CardHeader>
                    <CardContent>
                      <div className="text-3xl text-orange-300">
                        {isRequisitionerLoading ? (
                          <Loader2 className="animate-spin" />
                        ) : (
                          RequisitionerCount
                        )}
                      </div>
                    </CardContent>
                  </Card>

                  <Card
                    className="bg-slate-100 border-none hover:cursor-pointer"
                    onClick={() => navigate("/admin/campus-directorr")}
                  >
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                      <CardTitle className="text-2xl font-semibold">
                        Campus Director
                      </CardTitle>
                      <UserIcon />
                    </CardHeader>
                    <CardContent>
                      <div className="text-3xl text-orange-300">
                        {isCampusDirectorLoading ? (
                          <Loader2 className="animate-spin" />
                        ) : (
                          CampusDirectorCount
                        )}
                      </div>
                    </CardContent>
                  </Card>

                  <Card
                    className="bg-slate-100 border-none hover:cursor-pointer"
                    onClick={() => navigate("/admin/BACmembers")}
                  >
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                      <CardTitle className="text-2xl font-semibold">
                        BAC Members
                      </CardTitle>
                      <UsersRoundIcon />
                    </CardHeader>
                    <CardContent>
                      <div className="text-3xl text-orange-300">
                        {isBACmemberLoading ? (
                          <Loader2 className="animate-spin" />
                        ) : (
                          BACmemberCount
                        )}
                      </div>
                    </CardContent>
                  </Card>
                </div>

                {/* Second Column: Recent Activity */}
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
    </DashboardLayout>
  );
};

export default AdminDashboard;
