import { AxiosError } from "axios";
import { ApiResponse } from "@/types/api-response";


export const handleSucess = <T>(response: { data: T }): ApiResponse<T> => {
  console.log(response);
  return {
    status: "success",
    data: response.data,
  };
};

export const handleError = (error: unknown): ApiResponse<never> => {
  const message = (error as AxiosError).response?.data?.message || (error as Error).message
  console.error('Error', message)
  return {
    status: 'error',
    message,
    statusCode: (error as AxiosError).response?.status,
  }
};
