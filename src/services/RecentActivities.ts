import api from "@/api";
import { ActivityType } from "@/types/request/recent-activity";
import { ApiResponse } from "@/types/response/api-response";
import { handleError, handleSucess } from "@/utils/apiHelper";
import { useQuery } from "@tanstack/react-query";

export const getAllRecentActivities = async ():Promise<ApiResponse<ActivityType[]>> => {
  try {
    const response = await api.get<ActivityType[]>("api/recent-activities/");
    return handleSucess(response)
  } catch (error) {
    return handleError(error)
  }
}

export const useGetAllRecentActivities = () => {
  return useQuery({
    queryKey: ["recent-activities"],
    queryFn: getAllRecentActivities
  })
}
