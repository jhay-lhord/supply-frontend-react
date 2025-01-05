import api from "@/api";
import { ApiResponse } from "@/types/response/api-response";
import { ItemType } from "@/types/request/item";
import { handleError, handleSucess } from "@/utils/apiHelper";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { itemType } from "@/types/response/item";

export const GetItems = async (): Promise<ApiResponse<itemType[]>> => {
  try {
    const response = await api.get<itemType[]>("api/item/");
    return handleSucess(response);
  } catch (error) {
    console.log(error)
    return handleError(error);
  }
};

export const useItem = () => {
  return useQuery<ApiResponse<itemType[]>, Error>({
    queryKey: ["items"],
    queryFn: GetItems,
    refetchInterval: 5000,
  });
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

export const GetItemInPurchaseRequest = async (filters: { pr_no?: string; }):Promise<ApiResponse<itemType>> => {
  console.log("called in function")
  try {
    const params = new URLSearchParams();

    if (filters.pr_no) params.append('pr_no', filters.pr_no);
    console.log(params)
    
    const response = await api.get("api/purchase-request/item/filter/", {params})
    console.log(response)
    return handleSucess(response)
  } catch (error) {
    return handleError(error)
  }
}

// Use this if rendering the latet items in the Purchase request or need to access the loading state
export const useGetItemInPurchaseRequest = (filters: { pr_no?: string; }) => {
  console.log("called in hooks")
  return useQuery({
    queryKey: ["items", filters],
    queryFn: () => GetItemInPurchaseRequest(filters),
    enabled: !!filters.pr_no, 
  })
} 

// Use This if only rendering the data for better performance
export const FilteredItemInPurchaseRequest = (pr_no: string) => {
  const { data } = useItem();

  return (
    data &&
    data.data?.filter((item: itemType) => item.pr_details.pr_no === pr_no)
  );
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

export const arraySort = <T>(array: T[], key: keyof T): T[] => {
  return array
    ? [...array].sort((a, b) => {
        if (a[key] < b[key]) return -1;
        if (a[key] > b[key]) return 1;
        return 0;
      })
    : [];
};
