import api from "@/api"
import { handleError, handleSucess } from "@/utils/apiHelper"
import { useQuery } from "@tanstack/react-query"

export const getAllDailyReport = async () => {
  try {
    const response = await api.get("api/daily-report")
    return handleSucess(response)
  } catch (error) {
    return handleError(error)
  }
}

export const useGetDailyReport = () => {
  return useQuery({
    queryKey: ["daily-reports"],
    queryFn: getAllDailyReport
  })
}