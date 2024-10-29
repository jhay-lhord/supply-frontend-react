import api from "@/api";
import { ApiResponse } from "@/types/response/api-response";
import { UsersType } from "@/types/response/users";
import { handleError, handleSucess } from "@/utils/apiHelper";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

// Step 2 define the request

export const getUsers = async (): Promise<ApiResponse<UsersType[]>> => {
  try {
    const response = await api.get<UsersType[]>("api/users/");
    console.log(response);
    return handleSucess(response);
  } catch (error) {
    return handleError(error);
  }
};

export const useGetUsers = () => {
  return useQuery<ApiResponse<UsersType[]>>({
    queryKey: ["users"],
    queryFn: getUsers,
    refetchInterval: 5000,
  });
};

export const activateUser = async ({
  id,
  status,
}: {
  id: string;
  status: boolean;
}): Promise<ApiResponse<UsersType>> => {
  try {
    const response = await api.patch(`/api/user/${id}`, {
      is_active: status,
    });
    return handleSucess(response);
  } catch (error) {
    return handleError(error);
  }
};

export const useActivateUser = (action: string) => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: activateUser,
    onSuccess: () => {
      queryClient.invalidateQueries({queryKey: ["users"]})
      toast.success(`Successfully ${action}!`, {
        description: `Users successfully ${action}`
      });
    }
    
  })
}
