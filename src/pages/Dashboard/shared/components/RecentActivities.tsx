import { useGetAllRecentActivities } from "@/services/RecentActivities";
import { useMemo } from "react";
import { TimeAgo } from "./GetTimeAgo";
import { extractModelName } from "@/services/extractModelName";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useGetUserInformation } from "@/services/useProfile";
import Loading from "./Loading";

export const RecentActivities = () => {
  const { data, isLoading } = useGetAllRecentActivities();
  const { trimmedUserRole } = useGetUserInformation()
  const recentActivites = useMemo(() => {
    const _data = Array.isArray(data?.data) ? data.data : [];
    return _data;
  }, [data]);

  if(isLoading) return <Loading/>

  return (
    <div>
      {recentActivites.map((recent, index) => (
        <div
          key={index}
          className="mb-4 shadow p-4 flex gap-2 items-center rounded-md"
        >
          <Avatar className="h-10 w-10">
            <AvatarImage src="/avatars/01.png" alt="@shadcn" />
            <AvatarFallback className="bg-gradient-to-r from-orange-200 to-orange-300 text-base">
              {trimmedUserRole(recent.user_role)}
            </AvatarFallback>
          </Avatar>
          <div className="space-y-1 flex flex-col items-center ">
            <p className="text-xs text-muted-foreground ">
              <span className=" font-medium leading-none mr-1">
                {recent.user}
              </span>
              <span
                className={`${
                  recent.activity_type === "Deleted"
                    ? "text-red-400"
                    : "text-green-400"
                } mr-1`}
              >
                {recent.activity_type}
              </span>
              <span>{extractModelName(recent.content_type)}</span>
              <p className="text-xs text-muted-foreground pt-1">
                {TimeAgo(recent.timestamp)}
              </p>
            </p>
          </div>
        </div>
      ))}
    </div>
  );
};
