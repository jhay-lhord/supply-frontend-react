import { AxiosError } from "axios";
import { ApiResponse } from "@/types/response/api-response";


export const handleSucess = <T>(response: { data: T }): ApiResponse<T> => {
  return {
    status: "success",
    data: response.data,
  };
};

export const handleError = (error: unknown): ApiResponse<never> => {
  return {
    status: 'error',
    error: error as AxiosError,
    statusCode: (error as AxiosError).response?.status,
  }
};
