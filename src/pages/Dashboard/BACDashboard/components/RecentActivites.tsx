import { useGetAllRecentActivities } from "@/services/RecentActivities";
import { useMemo } from "react";

export const RecentActivites = () => {
  const { data } = useGetAllRecentActivities();
  const recentActivites = useMemo(() => {
    const _data = Array.isArray(data?.data) ? data.data : [];
    return _data;
  }, [data]);
  return (
    <div>
      {recentActivites.map((recent) => (
        <div>
          <p className="text-xl">{recent.user}</p>
          <p className="text-xl">{recent.activity_type} {recent.content_type}</p>
          <p className="text-xl">{recent.timestamp}</p>
        </div>
      ))}
    </div>
  );
};
