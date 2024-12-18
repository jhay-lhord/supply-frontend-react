import api from "@/api"
import { handleError, handleSucess } from "@/utils/apiHelper"
import { useQuery } from "@tanstack/react-query"

export const getAllBACDailyReport = async () => {
  try {
    const response = await api.get("api/daily-report/bac")
    return handleSucess(response)
  } catch (error) {
    return handleError(error)
  }
}

export const useGetBACDailyReport = () => {
  return useQuery({
    queryKey: ["bac-daily-reports"],
    queryFn: getAllBACDailyReport
  })
}

export const getAllSupplyDailyReport = async () => {
  try {
    const response = await api.get("api/daily-report/supply")
    return handleSucess(response)
  } catch (error) {
    return handleError(error)
  }
}

export const useGetSupplyDailyReport = () => {
  return useQuery({
    queryKey: ["supply-daily-reports"],
    queryFn: getAllSupplyDailyReport
  })
}