import Layout from "./components/Layout/BACDashboardLayout";
import PurchaseRequestInProgressDataTable from "./components/PurchaseRequestInProgressDataTable";

const BACPurchaseRequestInProgress: React.FC = () => {
  return (
    <Layout>
      <PurchaseRequestInProgressDataTable />
    </Layout>
  );
};

export default BACPurchaseRequestInProgress;
