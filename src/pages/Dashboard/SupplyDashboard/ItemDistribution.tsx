import Layout from "./components/Layout/SupplyDashboardLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ItemDistributionDataTable } from "./components/ItemDistributionDataTable";
import { Package } from "lucide-react";

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
          <ItemDistributionDataTable />
        </CardContent>
      </Card>
    </Layout>
  );
};

export default ItemDistribution;
