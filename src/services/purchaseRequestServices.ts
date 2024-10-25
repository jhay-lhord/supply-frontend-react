import api from "@/api";
import { useQuery } from "@tanstack/react-query";
import { ApiResponse } from "@/types/response/api-response";
import { purchaseRequestType } from "@/types/response/puchase-request";
import { handleError, handleSucess } from "@/utils/apiHelper";

export const GetPurchaseRequest = async (): Promise<
  ApiResponse<purchaseRequestType[]>
> => {
  try {
    const response = await api.get<purchaseRequestType[]>(
      "/api/purchase-request/"
    );
    console.log(response);
    return handleSucess(response);
  } catch (error) {
    return handleError(error);
  }
};

export const GetPurchaseRequestList = async (
  pr_no: string
): Promise<ApiResponse<purchaseRequestType>> => {
  try {
    const response = await api.get<purchaseRequestType>(
      `api/purchase-request/${pr_no}`
    );
    console.log(response);
    return handleSucess(response);
  } catch (error) {
    return handleError(error);
  }
};

export const AddPurchaseRequest = async (data: {
  pr_no: string;
  res_center_code: string;
  purpose: string;
  pr_status: string;
  requested_by: string;
  approved_by: string;
}) => {
  try {
    const response = await api.post("api/purchase-request/", data);
    console.log(response);
    return handleSucess(response);
  } catch (error) {
    return handleError(error);
  }
};

export const UpdatePurchaseRequest = async (data: {
  pr_no: string;
  res_center_code: string;
  purpose: string;
  status: string;
  requested_by: string;
  approved_by: string;
}) => {
  try {
    const response = await api.put(`api/purchase-request/${data.pr_no}`, data);
    return handleSucess(response);
  } catch (error) {
    return handleError(error);
  }
};

export const usePurchaseRequest = () => {
  return useQuery<ApiResponse<purchaseRequestType[]>, Error>({
    queryKey: ["purchase-request"],
    queryFn: GetPurchaseRequest,
  });
};

export const usePurchaseRequestCount = () => {
  const {data, isLoading} = usePurchaseRequest();
  const purchaseRequestCount = data?.data?.length
  return {purchaseRequestCount, isLoading}
};

export const usePurchaseRequestInProgressCount = () => {
  const {data, isLoading} = usePurchaseRequest();
  const purchase_request_in_progress = data?.data?.map(data => {
    return data
  }).filter(data => {
    return data.status === "Ready for Canvassing"
  })
  const inProgressCount = purchase_request_in_progress?.length
  return {inProgressCount, isLoading}
}

export const usePurchaseRequestInProgress = () => {
  const {data, isLoading} = usePurchaseRequest()

  const purchaseRequestInProgress = data?.data?.map(data => {
    return data
  }).filter(data => {
    return data.status === "Ready for Canvassing"
  })

  return {purchaseRequestInProgress, isLoading}

}
export const usePurchaseRequestList = (pr_no: string) => {
  return useQuery<ApiResponse<purchaseRequestType>, Error>({
    queryKey: ["purchase_request", pr_no],
    queryFn: () => GetPurchaseRequestList(pr_no!),
    enabled: !!pr_no,
  });
};
export const GetPurchaseRequestItem = async (): Promise<
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

export const deletePurchaseRequest = async (pr_no: string): Promise<T> => {
  try {
    const response = await api.delete(`/api/purchase-request/${pr_no}`);
    console.log(response);
    return handleSucess(response);
  } catch (error) {
    return handleError(error);
  }
};
