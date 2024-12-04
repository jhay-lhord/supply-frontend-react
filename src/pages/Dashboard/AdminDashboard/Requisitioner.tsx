

import RequisitionerForm from "./components/requisitionerForm";
import Layout from "./components/Layout/AdminDashboardLayout";

const Requisitioner: React.FC = () => {
  return (
    <Layout>
      
      <div className=" w-full">
        <RequisitionerForm />
      </div>
    </Layout>
  );
};

export default Requisitioner;
