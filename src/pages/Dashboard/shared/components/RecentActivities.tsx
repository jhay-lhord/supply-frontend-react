import { useGetAllRecentActivities } from "@/services/RecentActivities";
import { useMemo } from "react";
import { TimeAgo } from "./GetTimeAgo";
import { extractModelName } from "@/services/extractModelName";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { trimmedUserRole } from "@/services/useProfile";

export const RecentActivities = () => {
  const { data } = useGetAllRecentActivities();
  const recentActivites = useMemo(() => {
    const _data = Array.isArray(data?.data) ? data.data : [];
    return _data;
  }, [data]);

  return (
    <div>
      {recentActivites.map((recent, index) => (
        <div key={index} className="mb-4 shadow p-4 flex gap-2 items-center">
          <Avatar className="h-14 w-14">
            <AvatarImage src="/avatars/01.png" alt="@shadcn" />
            <AvatarFallback className="bg-orange-100 text-base">
              {trimmedUserRole(recent.user_role)}
            </AvatarFallback>
          </Avatar>
          <div className="space-y-1 flex flex-col">
            <p className="text-sm text-muted-foreground">
              <span className="text-base font-medium leading-none">
                {recent.user}{" "}
              </span>
              <span
                className={`${
                  recent.activity_type === "Deleted"
                    ? "text-red-400"
                    : "text-green-400"
                } text-base`}
              >
                {recent.activity_type}{" "}
              </span>
              <span className="text-base">
                {extractModelName(recent.content_type)}
              </span>
            </p>
            <p className="text-xs text-muted-foreground pb-2">
              {TimeAgo(recent.timestamp)}
            </p>
          </div>
        </div>
      ))}
    </div>
  );
};
