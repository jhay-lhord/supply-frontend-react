import { ApiResponse } from "@/types/response/api-response";
import { usePurchaseRequest } from "./purchaseRequestServices";
import { purchaseOrderItemType, purchaseOrderType } from "@/types/request/purchase-order";
import api from "@/api";
import { handleError, handleSucess } from "@/utils/apiHelper";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

export const getAllPurchaseOrder = async ():Promise<ApiResponse<purchaseOrderType[]>> => {
  try {
    const response = await api.get<purchaseOrderType[]>("api/purchase-order/")
    return handleSucess(response)
  } catch (error) {
    return handleError(error)
  }
}


export const useGetAllPurchaseOrder = () => {
  return useQuery<ApiResponse<purchaseOrderType[]>, Error>({
    queryFn: getAllPurchaseOrder,
    queryKey: ["purchase-orders"]
  })
}

export const useGetPurchaseOrder = () => {
  const { data: purchase_request, isLoading } = usePurchaseRequest();

  const purchase_order = purchase_request?.data?.map(data => {
    return data
  }).filter(data => {
    return data.status === "Ready for Purchase Order"
  })
  console.log(purchase_order)
  return {purchase_order, isLoading}
};

export const usePurchaseOrderCount = () => {
  const { purchase_order, isLoading} = useGetPurchaseOrder();
  const purchase_order_count = purchase_order?.length
  return {purchase_order_count, isLoading}
}

export const addPurchaseOrder = async (data: purchaseOrderType):Promise<ApiResponse<purchaseOrderType>> => {
  try {
    const response = await api.post<purchaseOrderType>("api/purchase-order/", data);
    console.log(response)
    return handleSucess(response)
  } catch (error) {
    console.log(error)
    return handleError(error) 
  }
}

export const useAddPurchaseOrder = () => {
  const queryClient = useQueryClient();
  return useMutation<ApiResponse<purchaseOrderType>, Error, purchaseOrderType>({
    mutationFn: (data) => addPurchaseOrder(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["abstract-of-quotations"] });
    },
  });
}

export const addPurchaseOrderItem = async (data:purchaseOrderItemType):Promise<ApiResponse<purchaseOrderItemType>> => {
  try {
    const response = await api.post<purchaseOrderItemType>("api/purchase-order-item/", data);
    console.log(response)
    return handleSucess(response)
  } catch (error) {
    console.log(error)
    return handleError(error)
  }
}

export const useAddPurchaseOrderItem = () => {
  const queryClient = useQueryClient();
  return useMutation<ApiResponse<purchaseOrderItemType>, Error, purchaseOrderItemType>({
    mutationFn: (data) => addPurchaseOrderItem(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["abstract-of-quotations"] });
    },
  })
}