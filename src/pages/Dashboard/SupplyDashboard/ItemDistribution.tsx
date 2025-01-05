import Layout from "./components/Layout/SupplyDashboardLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ItemDeliveredDataTable } from "./components/ItemDeliveredDataTable";
import { Package } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ItemDistributedDataTable } from "./components/ItemDistributedDataTable";

const ItemDistribution: React.FC = () => {
  return (
    <Layout>
      <Card className="bg-slate-100 w-full">
        <CardHeader className="">
          <CardTitle className="flex justify-between">
            <h1 className="text-3xl font-bold mb-6 flex items-center">
              <Package className="mr-2" />
              Item Distribution
            </h1>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="delivered" className="">
            <TabsList className="grid grid-cols-2 rounded-md p-2 border bg-background w-96">
              <TabsTrigger value="delivered" className="data-[state=active]:bg-orange-200 rounded-md transition-all flex justify-between items-center">Delivered</TabsTrigger>
              <TabsTrigger value="distributed" className="data-[state=active]:bg-orange-200 rounded-md transition-all flex justify-between items-center">Distributed</TabsTrigger>
            </TabsList>
            <TabsContent value="delivered">
              <ItemDeliveredDataTable />
            </TabsContent>
            <TabsContent value="distributed">
              <ItemDistributedDataTable />
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </Layout>
  );
};

export default ItemDistribution;
