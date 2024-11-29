import api from "@/api";
import { ApiResponse } from "@/types/response/api-response";
import { handleError, handleSucess } from "@/utils/apiHelper";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useToast } from "@/hooks/use-toast";
import { CampusDirectorType } from "@/types/request/campus-director";


export const GetCampusDirectors = async (): Promise<
  ApiResponse<CampusDirectorType[]>
> => {
  try {
    const response = await api.get<CampusDirectorType[]>(
      "/api/campus-director/"
    )
    return handleSucess(response);
  } catch (error) {
    return handleError(error);
  }
};

export const AddCampusDirector = async (data: CampusDirectorType) => {
  try {
    const response = await api.post("api/campus-director/", data);
    return handleSucess(response);
  } catch (error) {
    console.log(error)
    return handleError(error);
  }
};

export const useAddCampusDirector = () => {
  const queryClient = useQueryClient();
  return useMutation<ApiResponse<CampusDirectorType>, Error, CampusDirectorType>({
    mutationFn: (data) => AddCampusDirector(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["campus-directors"] });
    },
  });
};



export const getAllCampusDirector = async ():Promise<ApiResponse<CampusDirectorType[]>> => {
  try {
    const response = await api.get<CampusDirectorType[]>("api/campus-director/");
    return handleSucess(response)
  } catch (error) {
    return handleError(error)
  }
}

export const useGetAllCampusDirector = () => {
  
  return useQuery<ApiResponse<CampusDirectorType[]>, Error>({
    queryFn: getAllCampusDirector,
    queryKey:["campus-directors"]
  
  });
};

export const deleteCampusDirector = async (cd_id: string) => {
  try {
    const response = await api.delete(`api/campus-director/${cd_id}`);
    return handleSucess(response);
  } catch (error) {
    return handleError(error);
  }
};

export const useDeleteCampusDirector = () => {
  const queryClient = useQueryClient(); 
  const {toast} = useToast();
  return useMutation({
    mutationFn: deleteCampusDirector,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["campus-directors"] });
      toast({title:"delete", description:"Deleted Successfully"})
    },
  });
};


export const GetCampusDirector = async (cd_id: string): Promise<ApiResponse<CampusDirectorType>> => {
  try {
    const response = await api.get<CampusDirectorType>(`api/campus-director/${cd_id}`);
    return handleSucess(response);
  } catch (error) {
    return handleError(error);
  }
};

export const useGetCampusDirector = (cd_id: string) => {
  return useQuery<ApiResponse<CampusDirectorType>, Error>({
    queryKey: ["campus-directors", cd_id],
    queryFn: () => GetCampusDirector(cd_id!),
  });
};

export const UpdateCampusDirector = async (data: CampusDirectorType) => {
  try {
    const response = await api.put<CampusDirectorType>(`api/campus-director/${data.cd_id}`, data);
    return handleSucess(response);
  } catch (error) {
    return handleError(error);
  }
};

export const useUpdateCampusDirector = () => {
  const queryClient = useQueryClient();
  const {toast} = useToast();
  return useMutation<ApiResponse<CampusDirectorType>, Error, CampusDirectorType>({
    mutationFn: (data) => UpdateCampusDirector(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["campus-directors"] });
      toast({title:"Success", description:"Edit Successfully"})
    },
  });
};


export const useCampusDirector = () => {
  return useQuery<ApiResponse<CampusDirectorType[]>, Error>({
    queryKey: ["campus-directors"],
    queryFn: GetCampusDirectors,
    refetchInterval: 5000,
  });
};

export const useCampusDirectorCount = () => {
  const { data, isLoading } = useCampusDirector();
  const CampusDirectorCount = data?.data?.length;
  return { CampusDirectorCount, isLoading };
};