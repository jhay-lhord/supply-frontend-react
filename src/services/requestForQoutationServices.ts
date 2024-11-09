import api from "@/api";
import {
  qoutationType,
} from "@/types/request/request_for_qoutation";
import {
  itemQuotationResponseType,
  quotationResponseType,
} from "@/types/response/request-for-qoutation";
import { ApiResponse } from "@/types/response/api-response";
import { handleError, handleSucess } from "@/utils/apiHelper";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

export const getAllRequestForQoutation = async (): Promise<
  ApiResponse<quotationResponseType[]>
> => {
  try {
    const response = await api.get<quotationResponseType[]>(
      "/api/request-for-qoutation/"
    );
    return handleSucess(response);
  } catch (error) {
    return handleError(error);
  }
};

export const useRequestForQoutation = () => {
  return useQuery<ApiResponse<quotationResponseType[]>, Error>({
    queryFn: getAllRequestForQoutation,
    queryKey: ["request-for-qoutations"],
  });
};

export const useGetPurchaseRequestRequestBySupplier = (
  supplier_name: string
) => {
  const { data } = useRequestForQoutation();
  const requestForQoutationWithPr = data?.data
    ?.map((data) => data)
    .filter((data) => data.supplier_name === supplier_name);

  return requestForQoutationWithPr;
};

export const addRequestForQoutation = async (
  data: qoutationType
): Promise<ApiResponse<qoutationType>> => {
  try {
    const response = await api.post<qoutationType>(
      "/api/request-for-qoutation/",
      data
    );
    return handleSucess(response);
  } catch (error) {
    return handleError(error);
  }
};

export const useAddRequestForQoutation = () => {
  const queryClient = useQueryClient();
  return useMutation<ApiResponse<qoutationType>, Error, qoutationType>({
    mutationFn: (data) => addRequestForQoutation(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["request-for-qoutations"] });
    },
  });
};

export const getItemQuotation = async (): Promise<
  ApiResponse<itemQuotationResponseType[]>
> => {
  try {
    const response = await api.get<itemQuotationResponseType[]>(
      "/api/item-quotation/"
    );
    return handleSucess(response);
  } catch (error) {
    return handleError(error);
  }
};

export const useGetItemQuotation = () => {
  return useQuery<ApiResponse<itemQuotationResponseType[]>, Error>({
    queryFn: getItemQuotation,
    queryKey: ["items-quotation"],
  });
};


export const addItemQuotation = async (
  data: itemQuotationResponseType
): Promise<ApiResponse<itemQuotationResponseType>> => {
  try {
    const response = await api.post<itemQuotationResponseType>(
      "/api/item-quotation/",
      data
    );
    return handleSucess(response);
  } catch (error) {
    return handleError(error);
  }
};

export const useAddItemQuotation = () => {
  const queryClient = useQueryClient();
  return useMutation<ApiResponse<itemQuotationResponseType>, Error, itemQuotationResponseType>({
    mutationFn: (data) => addItemQuotation(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["items-quotation"] });
    },
  });
};

export const useRequestForQoutationCount = (pr_no: string) => {
  const { data } = useRequestForQoutation();

  const rfqCount = data?.data
    ?.map((data) => data)
    .filter((data) => data.purchase_request === pr_no).length;

  return rfqCount;
};
