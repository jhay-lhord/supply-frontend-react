import { AbstractItemContentList } from "./components/AbstractItemContentList";
import Layout from "./components/Layout/BACDashboardLayout";

export const BACItemList: React.FC = () => {
  return (
    <Layout>
        <AbstractItemContentList />
    </Layout>
  );
};
