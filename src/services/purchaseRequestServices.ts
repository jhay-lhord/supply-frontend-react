import api from "@/api"
import { ApiResponse } from "@/types/response/api-response"
import { purchaseRequestType } from "@/types/response/puchase-request"
import { handleError, handleSucess } from "@/utils/apiHelper"

export const getPurchaseRequest = async (): Promise<ApiResponse<purchaseRequestType>> => {
  try {
    const response = await api.get<purchaseRequestType[]>('/api/purchase-request/');
    return handleSucess(response);
  } catch (error) {
    return handleError(error)
  }
}

export const getPurchaseRequestCount = async (): Promise<number> => {
  const purchasePurchase = await getPurchaseRequest()

  if(purchasePurchase.status === "success"){
    console.log(purchasePurchase)
    return purchasePurchase.data?.length || 0;

  }
  return 0
}