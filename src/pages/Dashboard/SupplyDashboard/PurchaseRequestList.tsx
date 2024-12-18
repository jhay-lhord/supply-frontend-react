import PurchaseRequestItemList from "./components/PurchaseRequestItemList";
import Layout from "./components/Layout/SupplyDashboardLayout";

const PurchaseRequestList: React.FC = () => {
  return (
    <Layout>
        <PurchaseRequestItemList />
    </Layout>
  );
};

export default PurchaseRequestList;
