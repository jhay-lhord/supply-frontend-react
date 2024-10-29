import { usePurchaseRequest } from "./purchaseRequestServices";

export const useGetPurchaseOrder = () => {
  const { data: purchase_request, isLoading } = usePurchaseRequest();

  const purchase_order = purchase_request?.data?.map(data => {
    return data
  }).filter(data => {
    return data.status === "Ready for Purchase Order"
  })
  console.log(purchase_order)
  return {purchase_order, isLoading}
};

export const usePurchaseOrderCount = () => {
  const { purchase_order, isLoading} = useGetPurchaseOrder();
  const purchase_order_count = purchase_order?.length
  return {purchase_order_count, isLoading}
}
