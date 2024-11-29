import api from "@/api";
import { ApiResponse } from "@/types/response/api-response";
import { handleError, handleSucess } from "@/utils/apiHelper";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useToast } from "@/hooks/use-toast";
import { BACmemberType } from "@/types/request/BACmember";


export const GetBACmembers = async (): Promise<
  ApiResponse<BACmemberType[]>
> => {
  try {
    const response = await api.get<BACmemberType[]>(
      "/api/bac-member/"
    )
    return handleSucess(response);
  } catch (error) {
    return handleError(error);
  }
};

export const AddBACmember = async (data: BACmemberType) => {
  try {
    const response = await api.post("api/bac-member/", data);
    return handleSucess(response);
  } catch (error) {
    console.log(error)
    return handleError(error);
  }
};

export const useAddBACmember = () => {
  const queryClient = useQueryClient();
  return useMutation<ApiResponse<BACmemberType>, Error, BACmemberType>({
    mutationFn: (data) => AddBACmember(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["bac-members"] });
    },
  });
};



export const getAllBACmember = async ():Promise<ApiResponse<BACmemberType[]>> => {
  try {
    const response = await api.get<BACmemberType[]>("api/bac-member/");
    return handleSucess(response)
  } catch (error) {
    return handleError(error)
  }
}

export const useGetAllBACmember = () => {
  
  return useQuery<ApiResponse<BACmemberType[]>, Error>({
    queryFn: getAllBACmember,
    queryKey:["bac-members"]
  
  });
};

export const deleteBACmember = async (member_id: string) => {
  try {
    const response = await api.delete(`api/bac-member/${member_id}`);
    return handleSucess(response);
  } catch (error) {
    return handleError(error);
  }
};

export const useDeleteBACmember = () => {
  const queryClient = useQueryClient(); 
  const {toast} = useToast();
  return useMutation({
    mutationFn: deleteBACmember,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["bac-members"] });
      toast({title:"delete", description:"Deleted Successfully"})
    },
  });
};


export const GetBACmember = async (member_id: string): Promise<ApiResponse<BACmemberType>> => {
  try {
    const response = await api.get<BACmemberType>(`api/bac-member/${member_id}`);
    return handleSucess(response);
  } catch (error) {
    return handleError(error);
  }
};

export const useGetBACmember = (member_id: string) => {
  return useQuery<ApiResponse<BACmemberType>, Error>({
    queryKey: ["bac-members", member_id],
    queryFn: () => GetBACmember(member_id!),
  });
};

export const UpdateBACmember = async (data: BACmemberType) => {
  try {
    const response = await api.put<BACmemberType>(`api/bac-member/${data.member_id}`, data);
    return handleSucess(response);
  } catch (error) {
    return handleError(error);
  }
};

export const useUpdateBACmember = () => {
  const queryClient = useQueryClient();
  const {toast} = useToast();
  return useMutation<ApiResponse<BACmemberType>, Error, BACmemberType>({
    mutationFn: (data) => UpdateBACmember(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["bac-members"] });
      toast({title:"Success", description:"Edit Successfully"})
    },
  });
};

export const useBACmember = () => {
  return useQuery<ApiResponse<BACmemberType[]>, Error>({
    queryKey: ["bac-members"],
    queryFn: GetBACmembers,
    refetchInterval: 5000,
  });
};

export const useBACmemberCount = () => {
  const { data, isLoading } = useBACmember();
  const BACmemberCount = data?.data?.length;
  return { BACmemberCount, isLoading };
};
