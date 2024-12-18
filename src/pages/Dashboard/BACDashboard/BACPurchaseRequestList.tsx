import Layout from "./components/Layout/BACDashboardLayout";
import PurchaseRequestItemList from "./components/PurchaseRequestItemList";

const BACPurchaseRequestList: React.FC = () => {
  return (
    <Layout>
        <PurchaseRequestItemList />
    </Layout>
  );
};

export default BACPurchaseRequestList;
