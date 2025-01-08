import api from "@/api";
import { purchaseRequestStatusType } from "@/types/request/purchase-request-status";
import { ApiResponse } from "@/types/response/api-response";
import { handleError, handleSucess } from "@/utils/apiHelper";
import { useQuery } from "@tanstack/react-query";

export const GetAllStatusInPurchaseRequest = async (filters: { pr_no?: string; }):Promise<ApiResponse<purchaseRequestStatusType[]>> => {
  console.log("called in function")
  try {
    const params = new URLSearchParams();

    if (filters.pr_no) params.append('pr_no', filters.pr_no);
    console.log(params)
    
    const response = await api.get("api/track-purchase-request/filter", {params})
    console.log(response)
    return handleSucess(response)
  } catch (error) {
    return handleError(error)
  }
}

export const useGetAllStatusInPurchaseRequest = (filters: { pr_no?: string; }) => {
  console.log("called in hooks")
  return useQuery({
    queryKey: ["items", filters],
    queryFn: () => GetAllStatusInPurchaseRequest(filters),
    enabled: !!filters.pr_no, 
  })
} 