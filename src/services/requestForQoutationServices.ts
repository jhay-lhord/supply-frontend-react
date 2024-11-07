import api from "@/api";
import {
  requestForQoutationType,
  requestForQuotationItemDataType,
} from "@/types/request/request_for_qoutation";
import { ApiResponse } from "@/types/response/api-response";
import { handleError, handleSucess } from "@/utils/apiHelper";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

export const getAllRequestForQoutation = async (): Promise<
  ApiResponse<requestForQoutationType[]>
> => {
  try {
    const response = await api.get<requestForQoutationType[]>(
      "/api/request-for-qoutation/"
    );
    return handleSucess(response);
  } catch (error) {
    return handleError(error);
  }
};

export const useRequestForQoutation = () => {
  return useQuery<ApiResponse<requestForQoutationType[]>, Error>({
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
  data: requestForQuotationItemDataType
): Promise<ApiResponse<requestForQuotationItemDataType>> => {
  console.log(data);
  try {
    const response = await api.post<requestForQuotationItemDataType>(
      "/api/request-for-qoutation/",
      data
    );
    return handleSucess(response);
  } catch (error) {
    console.log(error);
    return handleError(error);
  }
};

export const useAddRequestForQoutation = () => {
  const queryClient = useQueryClient();
  return useMutation<
    ApiResponse<requestForQuotationItemDataType>,
    Error,
    requestForQuotationItemDataType
  >({
    mutationFn: (data) => addRequestForQoutation(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["request-for-qoutations"] });
    },
  });
};

export const useRequestForQoutationCount = (pr_no: string) => {
  const { data } = useRequestForQoutation();
  const requestForQoutationData = data?.data
    ?.map((data) => data)
    .filter((data) => data.purchase_request === pr_no);
  const rfqCount =
    requestForQoutationData && requestForQoutationData?.length != 0
      ? requestForQoutationData![requestForQoutationData!.length - 1]?.rfq_count
      : 0;
  return rfqCount;
};

export const FilterRequestOfQoutationByPR = () => {
  const { data } = useRequestForQoutation();

  // Extract unique `rfq_no` values from the data
  const rfq_nos = [...new Set(data?.data?.map(item => item.rfq_no))];
  
  // Filter data items to include only those with an `rfq_no` in `rfq_nos`
  const rfq_data = data?.data?.filter(item => rfq_nos.includes(item.rfq_no));

  return rfq_data;
};

// export const FilterRequestOfQoutationByPR = () => {
//   const { data } = useRequestForQoutation();

//   // Group data by `rfq_no`
//   const groupedData = data?.data?.reduce((acc, item) => {
//     const rfqNo = item.rfq_no;
    
//     // If `rfq_no` doesn't have an array in `acc`, create one
//     if (!acc[rfqNo]) {
//       acc[rfqNo] = [];
//     }

//     // Push item to the respective `rfq_no` array
//     acc[rfqNo].push(item);
    
//     return acc;
//   }, {});

//   return groupedData;
// };


