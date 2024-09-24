import api from "@/api"
import { ApiResponse } from "@/types/response/api-response"
import { purchaseOrderType } from "@/types/response/purchase-order"
import { handleError, handleSucess } from "@/utils/apiHelper"

export const getPurchaseOrder = async (): Promise<ApiResponse<purchaseOrderType[]>> => {
  try {
    const response = await api.get<purchaseOrderType[]>('/api/purchase-request/');
    return handleSucess(response);
  } catch (error) {
    return handleError(error)
  }
}

export const getPurchaseOrderCount = async (): Promise<number> => {
  const purchaseOrder = await getPurchaseOrder()

  if(purchaseOrder.status === "success"){
    console.log(purchaseOrder)
    return purchaseOrder.data?.length || 0;

  }
  return 0
}