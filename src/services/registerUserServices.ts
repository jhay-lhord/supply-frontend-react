import api from "@/api";
import { useToast } from "@/hooks/use-toast";
import { RegisterInputData } from "@/types/request/input";
import { ApiResponse } from "@/types/response/api-response";
import { handleError, handleSucess } from "@/utils/apiHelper";
import { useMutation, useQueryClient } from "@tanstack/react-query";

export const registerUser = async (
  data: RegisterInputData
): Promise<ApiResponse<RegisterInputData>> => {
  try {
    const response = await api.post<RegisterInputData>(
      "api/user/register/ ",
      data
    );
    return handleSucess(response);
  } catch (error) {
    console.log(error)
    return handleError(error);
  }
};

export const useRegisterUser = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();
  return useMutation<ApiResponse<RegisterInputData>, Error, RegisterInputData>({
    mutationFn: (data) => registerUser(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["users"] });
      toast({
        title: "Success",
        description:
          "Your account is pending activation by an administrator. You’ll be notified once it’s activated.",
      });
    },
  });
};
