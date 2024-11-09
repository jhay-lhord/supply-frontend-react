import { AxiosError } from "axios";

export interface ApiResponse<T>{
  status: 'success' | 'error';
  data?: T;
  error?: AxiosError;
  statusCode?: number;
}