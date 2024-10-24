import api from "@/api";
import { ApiResponse } from "@/types/response/api-response";
import { ItemType } from "@/types/request/item";
import { handleError, handleSucess } from "@/utils/apiHelper";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";

export const GetItem = async (): Promise<ApiResponse<ItemType[]>> => {
  try {
    const response = await api.get<ItemType[]>("api/item/");
    console.log(response);
    return handleSucess(response);
  } catch (error) {
    return handleError(error);
  }
};

export const AddItem = async (data: ItemType) => {
  try {
    const response = await api.post("api/item/", data);
    console.log(response)
    return handleSucess(response);
  } catch (error) {
    return handleError(error);
  }
};

export const deleteItem = async (id: string) => {
   try {
      const response = await api.delete(`api/item/${id}`)
      return handleSucess(response)
   } catch (error) {
      return handleError(error)
   }
}

export const useAddItem = () => {
  const queryClient = useQueryClient()
  return useMutation<ApiResponse<ItemType>, Error, ItemType>({
    mutationFn: (data) => AddItem(data),
    onSuccess: () => {
      queryClient.invalidateQueries({queryKey: ['items']})
    }
  })
}

export const FilteredItemInPurchaseRequest = (pr_no: string) => {
  const { data } = useItem();

  return (
    data &&
    data.data?.filter((item: ItemType) => item.purchase_request === pr_no)
  );
};


export const useItem = () => {
  return useQuery<ApiResponse<ItemType[]>, Error>({
    queryKey: ["items"],
    queryFn: GetItem,
  });
};
