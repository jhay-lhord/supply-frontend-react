import { AxiosError } from "axios";
import { ApiResponse } from "@/types/response/api-response";


export const handleSucess = <T>(response: { data: T }): ApiResponse<T> => {
  return {
    status: "success",
    data: response.data,
  };
};

export const handleError = (error: unknown): ApiResponse<never> => {
  const message = (error as AxiosError).response?.data?.message || (error as Error).message
  return {
    status: 'error',
    message,
    statusCode: (error as AxiosError).response?.status,
  }
};
