import Layout from "./components/Layout/BACDashboardLayout";
import { QuotationCard } from "./components/QuotationCard";

export const QuotationList: React.FC = () => {
  return (
    <Layout>
        <QuotationCard isDeleteAllowed={true} title={"All Supplier "} />
    </Layout>
  );
};
