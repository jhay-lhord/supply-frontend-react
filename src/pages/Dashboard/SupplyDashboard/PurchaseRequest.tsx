import PurchaseRequestDataTable from "./components/PurchaseRequestDataTable";
import Layout from "./components/Layout/SupplyDashboardLayout";

const PurchaseRequest: React.FC = () => {
  return (
    <Layout>
        <PurchaseRequestDataTable />
    </Layout>
  );
};

export default PurchaseRequest;
