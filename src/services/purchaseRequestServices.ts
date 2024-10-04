import api from "@/api";
import { useQuery } from "@tanstack/react-query";
import { ApiResponse } from "@/types/response/api-response";
import { purchaseRequestType } from "@/types/response/puchase-request";
import { handleError, handleSucess } from "@/utils/apiHelper";

export const getPurchaseRequest = async (): Promise<
  ApiResponse<purchaseRequestType[]>
> => {
  try {
    const response = await api.get<purchaseRequestType[]>(
      "/api/purchase-request/"
    );
    console.log(response)
    return handleSucess(response);
  } catch (error) {
    return handleError(error);
  }
};

export const usePurchaseRequest = () => {
  return useQuery<ApiResponse<purchaseRequestType[]>, Error>({queryKey: ['purchase-request'], queryFn: getPurchaseRequest})
}


export const getPurchaseRequestItem = async (): Promise<
  ApiResponse<purchaseRequestType[]>
> => {
  try {
    const response = await api.get<purchaseRequestType[]>(
      "/api/purchase-request-item/"
    );
    return handleSucess(response);
  } catch (error) {
    return handleError(error);
  }
};

export const getPurchaseRequestCount = async (): Promise<number> => {
  const purchasePurchase = await getPurchaseRequest();

  if (purchasePurchase.status === "success") {
    console.log(purchasePurchase);
    return purchasePurchase.data?.length || 0;
  }
  return 0;
};

export const deletePurchaseRequest = async (pr_no: string): Promise<T> => {
  try {
    const response = await api.delete(`/api/purchase-request/${pr_no}`);
    console.log(response);
    return handleSucess(response);
  } catch (error) {
    return handleError(error);
  }
};
