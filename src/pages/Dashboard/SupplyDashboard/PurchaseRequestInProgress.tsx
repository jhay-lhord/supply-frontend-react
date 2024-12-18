import PurchaseRequestInProgressDataTable from "./components/PurchaseRequestInProgressDataTable";
import Layout from "./components/Layout/SupplyDashboardLayout";

const PurchaseRequestInProgress: React.FC = () => {
  return (
    <Layout>
        <PurchaseRequestInProgressDataTable />
    </Layout>
  );
};

export default PurchaseRequestInProgress;
