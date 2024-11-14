import api from "@/api";
import { abstractType, itemSelectedQuoteType } from "@/types/request/abstract_of_quotation";
import { ApiResponse } from "@/types/response/api-response";
import { handleError, handleSucess } from "@/utils/apiHelper";
import { useMutation, useQueryClient } from "@tanstack/react-query";

export const addAbstractOfQuotation = async (data: abstractType):Promise<ApiResponse<abstractType>> => {
  try {
    console.log(data)
    const response = await api.post("/api/abstract-of-quotation/", data)
    console.log(response)
    return handleSucess(response)
  } catch (error) {
    console.log(error)
    return handleError(error)
  }
}

export const useAddAbstractOfQuotation = () => {
  const queryClient = useQueryClient()
  return useMutation<ApiResponse<abstractType>, Error, abstractType>({
    mutationFn: (data) => addAbstractOfQuotation(data),
    onSuccess: () => {
      queryClient.invalidateQueries({queryKey: ["abstract-of-quotations"]})
    }
  })
}

export const addItemSelectedQuote = async (data: itemSelectedQuoteType):Promise<ApiResponse<itemSelectedQuoteType>> => {
  try {
    console.log(data)
    const response = await api.post("api/item-selected-quote/", data)
    console.log(response)
    return handleSucess(response)
  } catch (error) {
    console.log(error)
    return handleError(error)
  }
}

export const useAddItemSelectedQuote = () => {
  const queryClient = useQueryClient();
  return useMutation<ApiResponse<itemSelectedQuoteType>, Error, itemSelectedQuoteType>({
    mutationFn: (data) => addItemSelectedQuote(data),
    onSuccess: () => {
      queryClient.invalidateQueries({queryKey: ["item-selected-quotes"]})
    }
  })
}