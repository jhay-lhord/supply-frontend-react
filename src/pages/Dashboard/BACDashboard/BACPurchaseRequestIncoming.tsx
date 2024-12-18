import Layout from "./components/Layout/BACDashboardLayout";
import PurchaseRequestIncomingDataTable from "./components/PurchaseRequestIncomingDataTable";

const BACPurchaseRequestIncoming: React.FC = () => {
  return (
    <Layout>
      <PurchaseRequestIncomingDataTable />
    </Layout>
  );
};

export default BACPurchaseRequestIncoming;
