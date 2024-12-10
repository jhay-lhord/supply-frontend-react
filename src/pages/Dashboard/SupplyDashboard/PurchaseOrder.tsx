import { useGetAllPurchaseOrder } from "@/services/puchaseOrderServices";
import PurchaseOrderInProgess from "./components/PurchaseOrderInProgress";
import SupplyAOQ from "./components/AbstractOfQuotation";
import Layout from "./components/Layout/SupplyDashboardLayout";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import {
  AlertCircle,
  CheckCircle2,
  Clock,
  Package,
  XCircle,
} from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import PurchaseOrderCompleted from "./components/PurchaseOrderCompleted";
import PurchaseOrderCancelled from "./components/PurchaseOrderCancelled";
import { useMemo } from "react";
import PurchaseOrderLacked from "./components/PurchaseOrderLacked";
import { Badge } from "@/components/ui/badge";

const PurchaseOrder: React.FC = () => {
  const { data: purchaseOrdersResponse } = useGetAllPurchaseOrder();

  const counts = useMemo(() => {
    if (!purchaseOrdersResponse?.data) return null;

    return purchaseOrdersResponse.data.reduce(
      (acc, order) => {
        switch (order.status) {
          case "To Order":
            acc.toOrder += 1;
            break;
          case "In Progress":
            acc.toReceive += 1;
            break;
          case "Completed":
            acc.completed += 1;
            break;
          case "Canceled":
            acc.canceled += 1;
            break;
          case "Lacking":
            acc.lackingItems += 1;
            break;
        }
        return acc;
      },
      {
        toOrder: 0,
        toReceive: 0,
        completed: 0,
        canceled: 0,
        lackingItems: 0,
      }
    );
  }, [purchaseOrdersResponse]);

  return (
    <Layout>
      <Card className="w-full">
        <CardHeader>
          <CardTitle>Purchase Orders</CardTitle>
          <CardDescription>
            Manage and track your purchase orders
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="to-order" className="w-full rounded-full">
            <TabsList className="grid grid-cols-5 rounded-md w-full p-2 ">
              {[
                {
                  label: "To Order",
                  value: "to-order",
                  count: counts?.toOrder,
                },
                {
                  label: "To Receive",
                  value: "to-receive",
                  count: counts?.toReceive,
                },
                {
                  label: "Completed",
                  value: "completed",
                  count: counts?.completed,
                },
                {
                  label: "Canceled",
                  value: "canceled",
                  count: counts?.canceled,
                },
                {
                  label: "Lacking Items",
                  value: "lacking-items",
                  count: counts?.lackingItems,
                },
              ].map((tab) => (
                <TabsTrigger
                  key={tab.value}
                  className="data-[state=active]:bg-orange-200 rounded-md transition-all flex justify-between items-center"
                  value={tab.value}
                >
                  <span>{tab.label}</span>
                  {tab.count !== 0 && (
                    <Badge className="h-6 w-6 flex items-center justify-center ">
                      {tab.count}
                    </Badge>
                  )}
                </TabsTrigger>
              ))}
            </TabsList>
            <TabsContent value="to-order">
              <Alert className="my-5">
                <AlertCircle className="h-4 w-4" />
                <AlertTitle>To Order</AlertTitle>
                <AlertDescription>
                  These purchase orders are ready to be placed.
                </AlertDescription>
              </Alert>
              <SupplyAOQ />
            </TabsContent>
            <TabsContent value="to-receive">
              <Alert className="my-5">
                <Clock className="h-4 w-4" />
                <AlertTitle>To Received</AlertTitle>
                <AlertDescription>
                  These purchase orders are currently being processed.
                </AlertDescription>
              </Alert>
              <PurchaseOrderInProgess />
            </TabsContent>
            <TabsContent value="completed">
              <Alert className="my-5">
                <CheckCircle2 className="h-4 w-4" />
                <AlertTitle>Completed</AlertTitle>
                <AlertDescription>
                  These purchase orders have been successfully fulfilled.
                </AlertDescription>
              </Alert>
              <PurchaseOrderCompleted />
            </TabsContent>
            <TabsContent value="canceled">
              <Alert variant="destructive" className="my-5">
                <XCircle className="h-4 w-4" />
                <AlertTitle>Cancelled</AlertTitle>
                <AlertDescription>
                  These purchase orders have been cancelled.
                </AlertDescription>
              </Alert>
              <PurchaseOrderCancelled />
            </TabsContent>
            <TabsContent value="lacking-items">
              <Alert className="my-5 border-purple-500 text-purple-500">
                <Package className="h-4 w-4" />
                <AlertTitle className="text-purple-600">
                  Lacking Delivered Items
                </AlertTitle>
                <AlertDescription className="text-purple-500">
                  These items have not been fully delivered as per the purchase
                  order.
                </AlertDescription>
              </Alert>
              <PurchaseOrderLacked />
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </Layout>
  );
};

export default PurchaseOrder;
