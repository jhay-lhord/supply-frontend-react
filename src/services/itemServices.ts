import api from "@/api";
import { ApiResponse } from "@/types/response/api-response";
import { ItemType } from "@/types/request/item";
import { handleError, handleSucess } from "@/utils/apiHelper";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

export const GetItems = async (): Promise<ApiResponse<ItemType[]>> => {
  try {
    const response = await api.get<ItemType[]>("api/item/");
    return handleSucess(response);
  } catch (error) {
    return handleError(error);
  }
};

export const AddItem = async (data: ItemType) => {
  try {
    const response = await api.post("api/item/", data);
    return handleSucess(response);
  } catch (error) {
    return handleError(error);
  }
};

export const deleteItem = async (id: string) => {
  try {
    const response = await api.delete(`api/item/${id}`);
    return handleSucess(response);
  } catch (error) {
    return handleError(error);
  }
};

export const useAddItem = () => {
  const queryClient = useQueryClient();
  return useMutation<ApiResponse<ItemType>, Error, ItemType>({
    mutationFn: (data) => AddItem(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["items"] });
    },
  });
};

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
    queryFn: GetItems,
  });
};

export const GetItem = async (id: string): Promise<ApiResponse<ItemType>> => {
  try {
    const response = await api.get<ItemType>(`api/item/${id}`);
    return handleSucess(response);
  } catch (error) {
    return handleError(error);
  }
};

export const useGetItem = (id: string) => {
  return useQuery<ApiResponse<ItemType>, Error>({
    queryKey: ["items", id],
    queryFn: () => GetItem(id!),
  });
};
export const UpdateItem = async (data: ItemType) => {
  try {
    const response = await api.put<ItemType>(`api/item/${data.item_no}`, data);
    return handleSucess(response);
  } catch (error) {
    return handleError(error);
  }
};

export const useUpdateItem = () => {
  const queryClient = useQueryClient();
  return useMutation<ApiResponse<ItemType>, Error, ItemType>({
    mutationFn: (data) => UpdateItem(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["items"] });
      toast.success("Edit Successfully", {
        description: "Item Edit Successfully",
      });
    },
  });
};

export const sortItemBaseOnPropertyNo = (items: ItemType[]) => {
  const key = "stock_property_no";
  console.log(items);
  return [...items].sort((a, b) => {
    if (a[key] < b[key]) return -1;
    if (a[key] > b[key]) return 1;
    return 0;
  });
};
