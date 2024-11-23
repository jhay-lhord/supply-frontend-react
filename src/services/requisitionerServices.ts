import api from "@/api";
import { RequisitionerType } from "@/types/request/requisitioner";
import { ApiResponse } from "@/types/response/api-response";
import { handleError, handleSucess } from "@/utils/apiHelper";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

export const AddRequisitioner = async (data: RequisitionerType) => {
  try {
    const response = await api.post("api/requisitioner/", data);
    return handleSucess(response);
  } catch (error) {
    console.log(error)
    return handleError(error);
  }
};

export const useAddRequisitioner = () => {
  const queryClient = useQueryClient();
  return useMutation<ApiResponse<RequisitionerType>, Error, RequisitionerType>({
    mutationFn: (data) => AddRequisitioner(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["requisitioners"] });
    },
  });
};



export const getAllRequisitioner = async ():Promise<ApiResponse<RequisitionerType[]>> => {
  try {
    const response = await api.get<RequisitionerType[]>("api/requisitioner/");
    return handleSucess(response)
  } catch (error) {
    return handleError(error)
  }
}

export const useGetAllRequisitioner = () => {
  
  return useQuery<ApiResponse<RequisitionerType[]>, Error>({
    queryFn: getAllRequisitioner,
    queryKey:["requisitioners"]
  
  });
};