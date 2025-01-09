import { ApiResponse } from "@/types/response/api-response";
import {
  _itemsDeliveredType,
  inspectionType,
  itemsDeliveredType,
  purchaseOrderItemType,
  purchaseOrderType,
} from "@/types/request/purchase-order";
import api from "@/api";
import { handleError, handleSucess } from "@/utils/apiHelper";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { purchaseOrderItemType_, purchaseOrdertype_ } from "@/types/response/purchase-order";
import { useMemo } from "react";

export const getAllPurchaseOrder = async (): Promise<
  ApiResponse<purchaseOrdertype_[]>
> => {
  try {
    const response = await api.get<purchaseOrdertype_[]>("api/purchase-order/");
    return handleSucess(response);
  } catch (error) {
    return handleError(error);
  }
};

export const useGetAllPurchaseOrder = () => {
  return useQuery<ApiResponse<purchaseOrdertype_[]>, Error>({
    queryFn: getAllPurchaseOrder,
    queryKey: ["purchase-orders"],
  });
};

export const getPurchaseOrder = async (
  po_no: string
): Promise<ApiResponse<purchaseOrdertype_>> => {
  try {
    const response = await api.get<purchaseOrdertype_>(
      `api/purchase-order/${po_no}`
    );
    console.log(response);
    return handleSucess(response);
  } catch (error) {
    console.log(error);
    return handleError(error);
  }
};

export const useGetPurchaseOrder = (po_no: string) => {
  return useQuery<ApiResponse<purchaseOrdertype_>, Error>({
    queryFn: () => getPurchaseOrder(po_no),
    queryKey: ["purchase-orders", po_no],
    enabled: !!po_no,
  });
};

export const usePurchaseOrderCount = () => {
  const { data, isLoading } = useGetAllPurchaseOrder();
  const purchaseOrderData = Array.isArray(data?.data) ? data.data : [];
  const purchase_order_count = purchaseOrderData?.length;
  return { purchase_order_count, isLoading };
};

export const usePurchaseOrderPendingCount = () => {
  const { data, isLoading } = useGetAllPurchaseOrder();
  const purchaseOrderData = Array.isArray(data?.data) ? data.data : [];
  const purchasePending = purchaseOrderData?.filter(
    (item) => item.status === "Pending"
  );
  const pendingCount = purchasePending?.length;
  return { pendingCount, isLoading };
};

export const usePurchaseOrderCompletedCount = () => {
  const { data, isLoading } = useGetAllPurchaseOrder();
  const purchaseOrderData = Array.isArray(data?.data) ? data.data : [];
  const purchaseCompleted = purchaseOrderData?.filter(
    (item) => item.status === "Completed"
  );
  const completedCount = purchaseCompleted?.length;
  return { completedCount, isLoading };
};

export const usePurchaseOrderCancelledCount = () => {
  const { data, isLoading } = useGetAllPurchaseOrder();
  const purchaseOrderData = Array.isArray(data?.data) ? data.data : [];
  const purchaseCancelled = purchaseOrderData?.filter(
    (item) => item.status === "Cancelled"
  );
  const cancelledCount = purchaseCancelled?.length;
  return { cancelledCount, isLoading };
};

export const addPurchaseOrder = async (
  data: purchaseOrderType
): Promise<ApiResponse<purchaseOrderType>> => {
  try {
    const response = await api.post<purchaseOrderType>(
      "api/purchase-order/",
      data
    );
    console.log(response);
    return handleSucess(response);
  } catch (error) {
    console.log(error);
    return handleError(error);
  }
};

export const useAddPurchaseOrder = () => {
  const queryClient = useQueryClient();
  return useMutation<ApiResponse<purchaseOrderType>, Error, purchaseOrderType>({
    mutationFn: (data) => addPurchaseOrder(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["abstract-of-quotations"] });
      queryClient.invalidateQueries({ queryKey: ["purchase-orders"] });
    },
  });
};

export const addPurchaseOrderItem = async (
  data: purchaseOrderItemType
): Promise<ApiResponse<purchaseOrderItemType>> => {
  try {
    const response = await api.post<purchaseOrderItemType>(
      "api/purchase-order-item/",
      data
    );
    console.log(response);
    return handleSucess(response);
  } catch (error) {
    console.log(error);
    return handleError(error);
  }
};

export const useAddPurchaseOrderItem = () => {
  const queryClient = useQueryClient();
  return useMutation<
    ApiResponse<purchaseOrderItemType>,
    Error,
    purchaseOrderItemType
  >({
    mutationFn: (data) => addPurchaseOrderItem(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["abstract-of-quotations"] });
      queryClient.invalidateQueries({ queryKey: ["purchase-order-item"] });
    },
  });
};

export const getPurchaseOrderItem = async (): Promise<
  ApiResponse<purchaseOrderItemType_[]>
> => {
  try {
    const response = await api.get<purchaseOrderItemType_[]>(
      "api/purchase-order-item/"
    );
    return handleSucess(response);
  } catch (error) {
    return handleError(error);
  }
};

export const useGetPurchaseOrderItem = () => {
  return useQuery<ApiResponse<purchaseOrderItemType_[]>, Error>({
    queryFn: getPurchaseOrderItem,
    queryKey: ["purchase-order-item"],
  });
};

export const updatePurchaseOrderStatus = async ({
  po_no,
  status,
}: {
  po_no: string;
  status: string;
}) => {
  try {
    const response = await api.patch(
      `api/purchase-order/${po_no}/update-status/`,
      { status }
    );
    return handleSucess(response);
  } catch (error) {
    return handleError(error);
  }
};

export const useUpdatePurchaseOrderStatus = () => {
  const queryClient = useQueryClient();
  return useMutation<
    ApiResponse<unknown>,
    Error,
    { po_no: string; status: string }
  >({
    mutationFn: ({ po_no, status }) =>
      updatePurchaseOrderStatus({ po_no, status }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["purchase-orders"] });
    },
  });
};

export const addInspectionReport = async (
  data: inspectionType
): Promise<ApiResponse<inspectionType>> => {
  try {
    const response = await api.post<inspectionType>(
      "api/inspection-report/",
      data
    );
    return handleSucess(response);
  } catch (error) {
    return handleError(error);
  }
};

export const useAddInspectionReport = () => {
  return useMutation<ApiResponse<inspectionType>, Error, inspectionType>({
    mutationFn: addInspectionReport,
    mutationKey: ["inspection-reports"],
  });
};

export const addItemsDelivered = async (
  data: itemsDeliveredType
): Promise<ApiResponse<itemsDeliveredType>> => {
  try {
    const response = await api.post<itemsDeliveredType>(
      "api/items-delivered/",
      data
    );
    console.log(response);
    return handleSucess(response);
  } catch (error) {
    console.log(error);
    return handleError(error);
  }
};

export const useAddItemsDelivered = () => {
  return useMutation<
    ApiResponse<itemsDeliveredType>,
    Error,
    itemsDeliveredType
  >({
    mutationFn: addItemsDelivered,
    mutationKey: ["items-delivered"],
  });
};

export const updateItemsDelivered = async ({
  id,
  data,
}: {
  id: number;
  data: itemsDeliveredType;
}): Promise<ApiResponse<itemsDeliveredType>> => {
  try {
    const response = await api.patch<itemsDeliveredType>(
      `api/items-delivered/${id}/update`,
      data
    );
    console.log(response);
    return handleSucess(response);
  } catch (error) {
    console.log(error);
    return handleError(error);
  }
};

export const useUpdateItemsDelivered = () => {
  const queryClient = useQueryClient();
  return useMutation<
    ApiResponse<unknown>,
    Error,
    { id: number; data: itemsDeliveredType }
  >({
    mutationFn: updateItemsDelivered,
    mutationKey: ["inspection-reports"],
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["items-delivered"] });
    },
  });
};

export const getItemsDelivered = async (): Promise<
  ApiResponse<_itemsDeliveredType[]>
> => {
  try {
    const response = await api.get<_itemsDeliveredType[]>(
      "api/items-delivered/"
    );
    return handleSucess(response);
  } catch (error) {
    return handleError(error);
  }
};

export const useGetItemsDelivered = () => {
  return useQuery<ApiResponse<_itemsDeliveredType[]>, Error>({
    queryFn: getItemsDelivered,
    queryKey: ["items-delivered"],
  });
};

export const GetItemsDeliveredInPurchaseRequest = async (filters: { pr_no?: string; }):Promise<ApiResponse<_itemsDeliveredType[]>> => {
  try {
    const params = new URLSearchParams();

    if (filters.pr_no) params.append('pr_no', filters.pr_no);
    console.log(params)
    const response = await api.get("api/items-delivered/purchase-request/filter/", {params})
    return handleSucess(response)
  } catch (error) {
    return handleError(error)
  }
}

export const useGetItemsDeliveredInPurchaseRequest = (filters: { pr_no?: string; }) => {
  return useQuery({
    queryKey: ["items-delivered", filters],
    queryFn: () => GetItemsDeliveredInPurchaseRequest(filters),
    enabled: !!filters.pr_no, 
  })
} 

export const useItemsDeliveredCount = () => {
  const { data } = useGetItemsDelivered();
  const itemsDeliveredData = useMemo(() => {
    return Array.isArray(data?.data) ? data.data : [];
  }, [data?.data]);
  const itemDeliveredCount = itemsDeliveredData.length ?? 0

  return { itemDeliveredCount}
};

export const addStockItems = async (
  data: itemsDeliveredType
): Promise<ApiResponse<itemsDeliveredType>> => {
  try {
    const response = await api.post<itemsDeliveredType>(
      "api/stock-items/",
      data
    );
    console.log(response);
    return handleSucess(response);
  } catch (error) {
    console.log(error);
    return handleError(error);
  }
};

export const useAddStockItems = () => {
  return useMutation<
    ApiResponse<itemsDeliveredType>,
    Error,
    itemsDeliveredType
  >({
    mutationFn: addStockItems,
    mutationKey: ["stock-items"],
  });
};

export const getStockItems = async (): Promise<
  ApiResponse<_itemsDeliveredType[]>
> => {
  try {
    const response = await api.get<_itemsDeliveredType[]>("api/stock-items/");
    return handleSucess(response);
  } catch (error) {
    return handleError(error);
  }
};

export const useGetStockItems = () => {
  return useQuery<ApiResponse<_itemsDeliveredType[]>, Error>({
    queryFn: getStockItems,
    queryKey: ["stock-items"],
  });
};
