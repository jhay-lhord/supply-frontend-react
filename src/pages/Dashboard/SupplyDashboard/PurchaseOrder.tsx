import { useGetPurchaseOrder } from "@/services/puchaseOrderServices";
import PurchaseOrderDataTable from "./components/PurchaseOrderDataTable";
import Layout from "./components/Layout/SupplyDashboardLayout";

const PurchaseOrder: React.FC = () => {
  useGetPurchaseOrder();
  return (
    <Layout>
        <PurchaseOrderDataTable />
    </Layout>
  );
};

export default PurchaseOrder;
