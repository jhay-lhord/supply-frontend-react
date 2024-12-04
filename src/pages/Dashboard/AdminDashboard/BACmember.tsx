

import BACmemberForm from "./components/BACmemberForm";
import Layout from "./components/Layout/AdminDashboardLayout";

const BACmember: React.FC = () => {
  return (
    <Layout>
     
      <div className=" w-full">
        <BACmemberForm />
      </div>
    </Layout>
  );
};

export default BACmember;
