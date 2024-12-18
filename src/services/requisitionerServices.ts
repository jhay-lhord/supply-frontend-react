import api from "@/api";
import { RequisitionerType } from "@/types/request/requisitioner";
import { ApiResponse } from "@/types/response/api-response";
import { handleError, handleSucess } from "@/utils/apiHelper";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useToast } from "@/hooks/use-toast";


export const GetRequisitioners = async (): Promise<
  ApiResponse<RequisitionerType[]>
> => {
  try {
    const response = await api.get<RequisitionerType[]>(
      "/api/requisitioner/"
    )
    return handleSucess(response);
  } catch (error) {
    return handleError(error);
  }
};

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

export const deleteRequisitioner = async (requisitoner_id: string) => {
  try {
    const response = await api.delete(`api/requisitioner/${requisitoner_id}`);
    return handleSucess(response);
  } catch (error) {
    return handleError(error);
  }
};

export const useDeleteRequisitioner = () => {
  const queryClient = useQueryClient(); 
  const {toast} = useToast();
  return useMutation({
    mutationFn: deleteRequisitioner,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["requisitioners"] });
      toast({title:"delete", description:"Deleted Successfully"})
    },
  });
};


export const GetRequisitioner = async (requisition_id: string): Promise<ApiResponse<RequisitionerType>> => {
  try {
    const response = await api.get<RequisitionerType>(`api/requisitioner/${requisition_id}`);
    return handleSucess(response);
  } catch (error) {
    return handleError(error);
  }
};

export const useGetRequisitioner = (requisition_id: string) => {
  return useQuery<ApiResponse<RequisitionerType>, Error>({
    queryKey: ["requisitioners", requisition_id],
    queryFn: () => GetRequisitioner(requisition_id!),
  });
};

export const UpdateRequisitioner = async (data: RequisitionerType) => {
  try {
    const response = await api.put<RequisitionerType>(`api/requisitioner/${data.requisition_id}`, data);
    return handleSucess(response);
  } catch (error) {
    return handleError(error);
  }
};

export const useUpdateRequisitioner = () => {
  const queryClient = useQueryClient();
  const {toast} = useToast();
  return useMutation<ApiResponse<RequisitionerType>, Error, RequisitionerType>({
    mutationFn: (data) => UpdateRequisitioner(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["requisitioners"] });
      toast({title:"Success", description:"Edit Successfully"})
    },
  });
};

export const useRequisitioner = () => {
  return useQuery<ApiResponse<RequisitionerType[]>, Error>({
    queryKey: ["requisitioners"],
    queryFn: GetRequisitioners,
    refetchInterval: 5000,
  });
};

export const useRequisitionerCount = () => {
  const { data, isLoading } = useRequisitioner();
  const RequisitionerCount = data?.data?.length;
  return { RequisitionerCount, isLoading };
};
