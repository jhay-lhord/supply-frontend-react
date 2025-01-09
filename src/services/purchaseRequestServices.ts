/* eslint-disable @typescript-eslint/no-unused-vars */
import api from "@/api";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { ApiResponse } from "@/types/response/api-response";
import { purchaseRequestType } from "@/types/response/puchase-request";
import { handleError, handleSucess } from "@/utils/apiHelper";
import { useMutation } from "@tanstack/react-query";
import {
  EditPRFormType,
  PurchaseRequestData,
} from "@/types/request/purchase-request";
import { useMemo, useState } from "react";

export const GetPurchaseRequest = async (): Promise<
  ApiResponse<purchaseRequestType[]>
> => {
  try {
    const response = await api.get<purchaseRequestType[]>(
      "/api/purchase-request/"
    );
    return handleSucess(response);
  } catch (error) {
    return handleError(error);
  }
};

export const GetPurchaseRequestList = async (
  pr_no: string
): Promise<ApiResponse<purchaseRequestType>> => {
  try {
    const response = await api.get<purchaseRequestType>(
      `api/purchase-request/${pr_no}`
    );
    return handleSucess(response);
  } catch (error) {
    return handleError(error);
  }
};

export const AddPurchaseRequest = async (data: PurchaseRequestData) => {
  try {
    const response = await api.post("api/purchase-request/", data);
    console.log(response);
    return handleSucess(response);
  } catch (error) {
    return handleError(error);
  }
};

export const useAddPurchaseRequest = () => {
  const queryClient = useQueryClient();
  return useMutation<
    ApiResponse<PurchaseRequestData>,
    Error,
    PurchaseRequestData
  >({
    mutationFn: (data) => AddPurchaseRequest(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["purchase-request"] });
    },
  });
};

export const updatePurchaseRequest = async ({
  pr_no,
  data,
}: {
  pr_no: string;
  data: EditPRFormType;
}) => {
  try {
    const response = await api.patch(
      `api/purchase-request/${pr_no}/edit/`,
      data
    );
    console.log(response);
    return handleSucess(response);
  } catch (error) {
    console.log(error);
    return handleError(error);
  }
};

export const useUpdatePurchaseRequest = () => {
  const queryClient = useQueryClient();
  return useMutation<
    ApiResponse<unknown>,
    Error,
    { pr_no: string; data: EditPRFormType }
  >({
    mutationFn: ({ pr_no, data }) => updatePurchaseRequest({ pr_no, data }),
    onSuccess: (_, variables) => {
      const { pr_no } = variables;
      queryClient.invalidateQueries({ queryKey: ["purchase-request", pr_no] });
    },
  });
};

export const usePurchaseRequest = () => {
  return useQuery<ApiResponse<purchaseRequestType[]>, Error>({
    queryKey: ["purchase-request"],
    queryFn: GetPurchaseRequest,
    refetchInterval: 5000,
  });
};

export const usePurchaseRequestCount = () => {
  const { data, isLoading } = usePurchaseRequest();
  const purchaseRequestCount = data?.data?.length;
  return { purchaseRequestCount, isLoading };
};

export const usePurchaseRequestPendingCount = () => {
  const { data, isLoading } = usePurchaseRequest();
  const purchaseRequestData = Array.isArray(data?.data) ? data.data : [];
  const pending = purchaseRequestData.filter(
    (data) => data.status === "Pending for Approval"
  );
  const requestPendingCount = pending.length ?? 0;

  return { requestPendingCount, isLoading };
};

export const usePurchaseRequestInProgress = () => {
  const { data, isLoading } = usePurchaseRequest();

  const purchaseRequestData = Array.isArray(data?.data) ? data.data : [];

  const purchaseRequestInProgress = purchaseRequestData.filter((data) => {
    return data.status === "Received by the Procurement";
  });

  return { purchaseRequestInProgress, isLoading };
};

export const usePurchaseRequestInProgressCount = () => {
  const inProgressStatus = [
    "Forwarded to Procurement",
    // "Received by the Procurement",
    // "Items Delivered",
    // "Ready to Order",
    // "Order Placed",
    // "Ready for Distribution",
  ];

  const { data, isLoading } = usePurchaseRequest();
  const purchaseRequestData = Array.isArray(data?.data) ? data.data : [];
  const inProgress = purchaseRequestData
    .filter((data) => inProgressStatus.includes(data.status))
    .map((data) => data);
  const requestInProgressCount = inProgress.length ?? 0;

  return { requestInProgressCount, isLoading };
};

export const usePurchaseRequestCompletedCount = () => {
  const { data, isLoading } = usePurchaseRequest();
  const purchaseRequestData = useMemo(() => {
    return Array.isArray(data?.data) ? data.data : [];
  }, [data?.data]);
  const completed = useMemo(() => {
    return purchaseRequestData.filter((data) => data.status === "Completed");
  }, [purchaseRequestData]);
  const requestCompletedCount = completed.length ?? 0;

  return { requestCompletedCount, isLoading };
};

export const usePurchaseRequestIncoming = () => {
  const { data, isLoading } = usePurchaseRequest();

  const inComing = Array.isArray(data?.data) ? data.data : [];

  const purchaseRequestIncoming = inComing
    ?.map((data) => {
      return data;
    })
    .filter((data) => {
      return data.status === "Forwarded to Procurement";
    });

  return { purchaseRequestIncoming, isLoading };
};

export const usePurchaseRequestList = (pr_no: string) => {
  return useQuery<ApiResponse<purchaseRequestType>, Error>({
    queryKey: ["purchase-request", pr_no],
    queryFn: () => GetPurchaseRequestList(pr_no!),
    enabled: !!pr_no,
  });
};

export const GetPurchaseRequestItem = async (): Promise<
  ApiResponse<purchaseRequestType[]>
> => {
  try {
    const response = await api.get<purchaseRequestType[]>(
      "/api/purchase-request-item/"
    );
    return handleSucess(response);
  } catch (error) {
    return handleError(error);
  }
};

export const deletePurchaseRequest = async (pr_no: string) => {
  try {
    const response = await api.delete(`/api/purchase-request/${pr_no}`);
    console.log(response);
    return handleSucess(response);
  } catch (error) {
    return handleError(error);
  }
};

export const updatePurchaseRequestStatus = async ({
  pr_no,
  status,
}: {
  pr_no: string;
  status: PurchaseRequestStatus;
}) => {
  try {
    const response = await api.patch(
      `api/purchase-request/${pr_no}/update-status/`,
      { status }
    );
    console.log(response);
    return handleSucess(response);
  } catch (error) {
    console.log(error);
    return handleError(error);
  }
};

export const useUpdatePurchaseRequestStatus = () => {
  const queryClient = useQueryClient();
  const [isPending, setIsPending] = useState(false);

  const mutation = useMutation<
    ApiResponse<unknown>,
    Error,
    { pr_no: string; status: PurchaseRequestStatus }
  >({
    mutationFn: ({ pr_no, status }) =>
      updatePurchaseRequestStatus({ pr_no, status }),
    onMutate: () => {
      setIsPending(true);
    },
    onSuccess: (_, variables) => {
      const { pr_no } = variables;

      queryClient.invalidateQueries({ queryKey: ["purchase-request", pr_no] });
      queryClient.invalidateQueries({ queryKey: ["purchase-requests"] });
    },
    onError: () => {
      setIsPending(false);
    },
    onSettled: () => {
      setIsPending(false);
    },
  });

  return {
    ...mutation,
    isPending,
  };
};

type PurchaseRequestStatus =
  | "Approved"
  | "Rejected"
  | "Cancelled"
  | "Forwarded to Procurement"
  | "Received by the Procurement"
  | "Items Delivered"
  | "Ready to Order"
  | "Order Placed"
  | "Ready for Distribution"
  | "Completed";

export const usePurchaseRequestActions = () => {
  const mutation = useUpdatePurchaseRequestStatus();
  const [isPendingApprove, setIsPendingApprove] = useState(false);
  const [isPendingReject, setIsPendingReject] = useState(false);
  const [isPendingCancel, setIsPendingCancel] = useState(false);
  const [isPendingForward, setIsPendingForward] = useState(false);
  const [isPendingReadyToOrder, setIsPendingReadyToOrder] = useState(false);
  const [isPendingOrderPlaced, setIsPendingOrderPlaced] = useState(false);
  const [isPendingDistribute, setIsPendingDistribute] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [isError, setIsError] = useState(false);

  const handleAction = async (status: PurchaseRequestStatus, pr_no: string) => {
    let setPendingState = (_state: boolean) => {}; // Default no-op function

    switch (status) {
      case "Approved":
        setPendingState = setIsPendingApprove;
        break;
      case "Rejected":
        setPendingState = setIsPendingReject;
        break;
      case "Cancelled":
        setPendingState = setIsPendingCancel;
        break;
      case "Forwarded to Procurement":
        setPendingState = setIsPendingForward;
        break;
      case "Ready to Order":
        setPendingState = setIsPendingReadyToOrder;
        break;
      case "Order Placed":
        setPendingState = setIsPendingOrderPlaced;
        break;
      case "Completed":
        setPendingState = setIsPendingDistribute;
        break;
    }

    setPendingState(true);

    try {
      await mutation.mutateAsync(
        { pr_no, status },
        {
          onSuccess: (response) => {
            if (response.status === "success") {
              setIsSuccess(true);
              setPendingState(false);
            } else {
              setIsError(true);
              setPendingState(false);
            }
          },
          onError: () => {
            setIsError(true);
            setPendingState(false);
          },
        }
      );
    } finally {
      setPendingState(false);
    }
  };

  return {
    handleApprove: (pr_no: string) => handleAction("Approved", pr_no),
    handleReject: (pr_no: string) => handleAction("Rejected", pr_no),
    handleCancel: (pr_no: string) => handleAction("Cancelled", pr_no),
    handleForward: (pr_no: string) =>
      handleAction("Forwarded to Procurement", pr_no),
    handleReadyToOrder: (pr_no: string) =>
      handleAction("Ready to Order", pr_no),
    handleOrderPlaced: (pr_no: string) => handleAction("Order Placed", pr_no),
    handleDistribute: (pr_no: string) => handleAction("Completed", pr_no),
    isPendingApprove,
    isPendingReject,
    isPendingCancel,
    isPendingForward,
    isPendingReadyToOrder,
    isPendingOrderPlaced,
    isPendingDistribute,
    isError,
    isSuccess,
  };
};

type MOPStatus =
  | "Direct Contracting"
  | "Small Value Procurement"
  | "Shopping"
  | "Public Bidding";

export const updatePurchaseRequestMOP = async ({
  pr_no,
  status,
}: {
  pr_no: string;
  status: MOPStatus;
}) => {
  try {
    const response = await api.patch(
      `api/purchase-request/${pr_no}/mop-update/`,
      { status }
    );
    console.log(response);
    return handleSucess(response);
  } catch (error) {
    console.log(error);
    return handleError(error);
  }
};

export const useUpdatePurchaseRequestMOP = () => {
  const queryClient = useQueryClient();
  const [isPending, setIsPending] = useState(false);

  const mutation = useMutation<
    ApiResponse<unknown>,
    Error,
    { pr_no: string; status: MOPStatus }
  >({
    mutationFn: ({ pr_no, status }) =>
      updatePurchaseRequestMOP({ pr_no, status }),
    onMutate: () => {
      setIsPending(true);
    },
    onSuccess: (_, variables) => {
      const { pr_no } = variables;

      queryClient.invalidateQueries({ queryKey: ["purchase-request", pr_no] });
      queryClient.invalidateQueries({ queryKey: ["purchase-requests"] });
    },
    onError: () => {
      setIsPending(false);
    },
    onSettled: () => {
      setIsPending(false);
    },
  });

  return {
    ...mutation,
    isPending,
  };
};
