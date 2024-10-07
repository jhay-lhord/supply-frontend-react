import api from "@/api";
import { ApiResponse } from "@/types/response/api-response";
import { itemType } from "@/types/response/item";
import { handleError, handleSucess } from "@/utils/apiHelper";
import { useQuery } from "@tanstack/react-query";

export const GetItem = async ():Promise<ApiResponse<itemType[]>> => {
  try{
    const response = await api.get<itemType[]>('api/item/');
    console.log(response)
    return handleSucess(response)
  }catch(error){
    return handleError(error)
  }
}

export const AddItem = async (data: {
  purchase_request: string;
  items: {
      purchase_request: string,
      item_no: string,
      item_property: string,
      unit: string,
      item_description: string,
      quantity: number,
      unit_cost: number,
      total_cost: number,}[]}) => {
  try {
    const response = await api.post("api/item/", data)
    return handleSucess(response)
  } catch (error) {
    return handleError(error)
  }
}

export const useItem = () => {
  return useQuery<ApiResponse<itemType[]>, Error>({
    queryKey: ["items"],
    queryFn: GetItem
  })
}